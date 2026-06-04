// 高考与祝福页面的时间边界，月份使用 JavaScript 的 0 起始索引。
const GAOKAO_MONTH = 5;
const GAOKAO_DAY = 7;
const GAOKAO_HOUR = 9;
const EXAM_END_DAY = 10;

// 倒计时内部结构与逻辑一起维护，HTML 只保留组件挂载点。
const countdownBody = document.querySelector("[data-countdown-body]");

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
	countdownView: document.querySelector("[data-countdown-view]"),
	wishesView: document.querySelector("[data-wishes-view]"),
	year: document.querySelector("[data-target-year]"),
	wishesYear: document.querySelector("[data-wishes-year]"),
	targetDate: document.querySelector("[data-target-date]"),
	copyrightYear: document.querySelector("[data-copyright-year]"),
	examProgress: document.querySelector("[data-exam-progress]"),
	days: document.querySelector("[data-days]"),
	hours: document.querySelector("[data-hours]"),
	minutes: document.querySelector("[data-minutes]"),
	seconds: document.querySelector("[data-seconds]"),
};

// 目标时间使用访问设备的本地时区格式化。
const targetDateFormatter = new Intl.DateTimeFormat("zh-CN", {
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});

function getGaokaoDate(year) {
	return new Date(year, GAOKAO_MONTH, GAOKAO_DAY, GAOKAO_HOUR);
}

function getGaokaoEndDate(year) {
	return new Date(year, GAOKAO_MONTH, EXAM_END_DAY);
}

// 根据当前时间决定显示当年倒计时、祝福页或下一年倒计时。
function getPageState(now = new Date()) {
	const currentYearExam = getGaokaoDate(now.getFullYear());
	const currentYearExamEnd = getGaokaoEndDate(now.getFullYear());

	if (now >= currentYearExam && now < currentYearExamEnd) {
		return {
			mode: "wishes",
			examDate: currentYearExam,
			examEnd: currentYearExamEnd,
		};
	}

	return {
		mode: "countdown",
		examDate: now < currentYearExam
			? currentYearExam
			: getGaokaoDate(now.getFullYear() + 1),
		examEnd: null,
	};
}

let pageState = getPageState();
let activeMode = "";

function updateSharedDetails(now) {
	elements.copyrightYear.textContent = String(now.getFullYear());
}

function showCountdownView() {
	const year = pageState.examDate.getFullYear();
	elements.countdownView.hidden = false;
	elements.wishesView.hidden = true;
	elements.year.textContent = String(year);
	elements.targetDate.textContent = targetDateFormatter.format(pageState.examDate);
	document.title = `${year}年高考倒计时`;
}

function showWishesView() {
	const year = pageState.examDate.getFullYear();
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
	const elapsed = now.getTime() - pageState.examDate.getTime();
	const examDay = Math.min(3, Math.floor(elapsed / 86400000) + 1);
	elements.examProgress.textContent = `高考第 ${examDay} 天`;
}

// 每秒重新判断状态，确保跨越边界时无需刷新页面。
function renderPage() {
	const now = new Date();
	const nextState = getPageState(now);

	if (
		nextState.mode !== pageState.mode
		|| nextState.examDate.getTime() !== pageState.examDate.getTime()
	) {
		pageState = nextState;
		activeMode = "";
	}

	updateSharedDetails(now);

	if (activeMode !== pageState.mode) {
		activeMode = pageState.mode;
		if (pageState.mode === "wishes") {
			showWishesView();
		} else {
			showCountdownView();
		}
	}

	if (pageState.mode === "wishes") {
		renderWishes(now);
	} else {
		renderCountdown(now);
	}
}

renderPage();
setInterval(renderPage, 1000);
