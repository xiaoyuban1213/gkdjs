// 高考与祝福页面的时间边界，月份使用 JavaScript 的 0 起始索引。
const GAOKAO_MONTH = 5;
const GAOKAO_DAY = 7;
const GAOKAO_HOUR = 9;
const EXAM_END_DAY = 10;
const BEIJING_TIME_ZONE = "Asia/Shanghai";
const BEIJING_UTC_OFFSET_HOURS = 8;
const DAY_MILLISECONDS = 86400000;

function requireElement(selector) {
	const element = document.querySelector(selector);
	if (!element) {
		throw new Error(`Required page element not found: ${selector}`);
	}
	return element;
}

// 倒计时内部结构与逻辑一起维护，HTML 只保留组件挂载点。
const countdownBody = requireElement("[data-countdown-body]");

countdownBody.innerHTML = `
	<div class="countdown" role="timer" aria-live="off" aria-label="距离高考开始的剩余时间">
		<div class="time-unit">
			<strong data-days>0</strong>
			<span>天</span>
		</div>
		<div class="time-unit">
			<strong data-hours>0</strong>
			<span>小时</span>
		</div>
		<div class="time-unit">
			<strong data-minutes>0</strong>
			<span>分钟</span>
		</div>
		<div class="time-unit">
			<strong data-seconds>0</strong>
			<span>秒</span>
		</div>
	</div>
	<div class="clock-feet" aria-hidden="true">
		<span></span>
		<span></span>
	</div>
`;

const elements = {
	countdownView: requireElement("[data-countdown-view]"),
	wishesView: requireElement("[data-wishes-view]"),
	year: requireElement("[data-target-year]"),
	wishesYear: requireElement("[data-wishes-year]"),
	targetDate: requireElement("[data-target-date]"),
	copyrightYear: requireElement("[data-copyright-year]"),
	examProgress: requireElement("[data-exam-progress]"),
	days: requireElement("[data-days]"),
	hours: requireElement("[data-hours]"),
	minutes: requireElement("[data-minutes]"),
	seconds: requireElement("[data-seconds]"),
};

const targetDateFormatter = new Intl.DateTimeFormat("zh-CN", {
	timeZone: BEIJING_TIME_ZONE,
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});

const beijingDatePartsFormatter = new Intl.DateTimeFormat("en-US", {
	timeZone: BEIJING_TIME_ZONE,
	year: "numeric",
	month: "numeric",
	day: "numeric",
});

function getBeijingDateParts(date) {
	return Object.fromEntries(
		beijingDatePartsFormatter.formatToParts(date)
			.filter(({ type }) => type !== "literal")
			.map(({ type, value }) => [type, Number(value)]),
	);
}

function getGaokaoDate(year) {
	return new Date(Date.UTC(
		year,
		GAOKAO_MONTH,
		GAOKAO_DAY,
		GAOKAO_HOUR - BEIJING_UTC_OFFSET_HOURS,
	));
}

function getGaokaoEndDate(year) {
	return new Date(Date.UTC(year, GAOKAO_MONTH, EXAM_END_DAY, -BEIJING_UTC_OFFSET_HOURS));
}

// 根据当前时间决定显示当年倒计时、祝福页或下一年倒计时。
function getPageState(now = new Date()) {
	const currentYear = getBeijingDateParts(now).year;
	const currentYearExam = getGaokaoDate(currentYear);
	const currentYearExamEnd = getGaokaoEndDate(currentYear);

	if (now >= currentYearExam && now < currentYearExamEnd) {
		return {
			mode: "wishes",
			examDate: currentYearExam,
		};
	}

	return {
		mode: "countdown",
		examDate: now < currentYearExam
			? currentYearExam
			: getGaokaoDate(currentYear + 1),
	};
}

let pageState = null;

function updateSharedDetails(now) {
	elements.copyrightYear.textContent = String(getBeijingDateParts(now).year);
}

function showCountdownView() {
	const year = getBeijingDateParts(pageState.examDate).year;
	elements.countdownView.hidden = false;
	elements.wishesView.hidden = true;
	elements.year.textContent = String(year);
	elements.targetDate.textContent = targetDateFormatter.format(pageState.examDate);
	document.title = `${year}年高考倒计时`;
}

function showWishesView() {
	const year = getBeijingDateParts(pageState.examDate).year;
	elements.countdownView.hidden = true;
	elements.wishesView.hidden = false;
	elements.wishesYear.textContent = String(year);
	document.title = `${year}年高考顺利`;
}

function renderCountdown(now) {
	const remaining = Math.max(0, pageState.examDate.getTime() - now.getTime());
	const totalSeconds = Math.floor(remaining / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	elements.days.textContent = String(days);
	elements.hours.textContent = String(hours);
	elements.minutes.textContent = String(minutes);
	elements.seconds.textContent = String(seconds);
}

// 祝福期按自然日显示高考第 1、2、3 天。
function renderWishes(now) {
	const currentDate = getBeijingDateParts(now);
	const examDate = getBeijingDateParts(pageState.examDate);
	const currentDay = Date.UTC(currentDate.year, currentDate.month - 1, currentDate.day);
	const examDayStart = Date.UTC(examDate.year, examDate.month - 1, examDate.day);
	const examDay = Math.min(3, Math.floor((currentDay - examDayStart) / DAY_MILLISECONDS) + 1);
	elements.examProgress.textContent = `高考第 ${examDay} 天`;
}

// 每秒重新判断状态，确保跨越边界时无需刷新页面。
function renderPage() {
	const now = new Date();
	const nextState = getPageState(now);
	const stateChanged = pageState === null
		|| nextState.mode !== pageState.mode
		|| nextState.examDate.getTime() !== pageState.examDate.getTime();
	pageState = nextState;

	if (stateChanged) {
		if (pageState.mode === "wishes") {
			showWishesView();
		} else {
			showCountdownView();
		}
	}

	updateSharedDetails(now);

	if (pageState.mode === "wishes") {
		renderWishes(now);
	} else {
		renderCountdown(now);
	}
}

renderPage();
setInterval(renderPage, 1000);
