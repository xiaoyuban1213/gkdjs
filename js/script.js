$(function() {
    // 缓存 jQuery 选择器
    var $countdownElements = $('.countdown[data-date]');
    // 倒计时功能初始化
    if($.isFunction($.fn.countdown)) {
        $countdownElements.each(function() {
            var $this = $(this);
            $this.countdown({
                date: $this.data('date'),
                render: function(data) {
                    $this.html(
                        "<div class=\"countdown-box\"><H4 class=\"countdown-number\">" + data.days + "</H4>" + " <h4 class=\"countdown-title\">天</h4></div>" +
                        "<div class=\"countdown-box\"><H4 class=\"countdown-number\">" + data.hours + "</H4>" + " <h4 class=\"countdown-title\">时</h4></div>" +
                        "<div class=\"countdown-box\"><H4 class=\"countdown-number\">" + this.leadingZeros(data.min, 2) + "</H4>" + " <h4 class=\"countdown-title\">分</h4></div>" +
                        "<div class=\"countdown-box\"><H4 class=\"countdown-number\">" + this.leadingZeros(data.sec, 2) + "</H4>" + " <h4 class=\"countdown-title\">秒</h4></div>"
                    );
                }
            });
        });
    }
}
)