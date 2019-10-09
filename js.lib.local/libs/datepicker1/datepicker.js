(function ($) {
    $.fn.extend({
        datepicker1: function (date, title, events, options) {
            var $this = $(this),
            /*补0*/
            _pad = function (n, c) {
                if ((n = n + '').length < c) { return new Array((++c) - n.length).join('0') + n; } else { return n; }
            },
            /*转换日期对象*/
            parseDate = function (date, format) {
                if (date.constructor == Date) {
                    return new Date(date);
                }
                var parts = date.split(/\W+/);
                var against = format.split(/\W+/), d, m, y, h, min,
                    now = new Date();
                for (var i = 0; i < parts.length; i++) {
                    switch (against[i]) {
                        case 'd': case 'e': d = parseInt(parts[i], 10); break;
                        case 'm': m = parseInt(parts[i], 10) - 1; break;
                        case 'Y': case 'y': y = parseInt(parts[i], 10); y += y > 100 ? 0 : (y < 29 ? 2000 : 1900); break;
                        case 'H': case 'I': case 'k': case 'l': h = parseInt(parts[i], 10); break;
                        case 'P': case 'p': if (/pm/i.test(parts[i]) && h < 12) { h += 12; } else if (/am/i.test(parts[i]) && h >= 12) { h -= 12; } break;
                        case 'M': min = parseInt(parts[i], 10); break;
                    }
                }
                return new Date(
                    y === undefined ? now.getFullYear() : y,
                    m === undefined ? now.getMonth() : m,
                    d === undefined ? now.getDate() : d,
                    h === undefined ? now.getHours() : h,
                    min === undefined ? now.getMinutes() : min,
                    0
                );
            },
            formatDate = function (date, format) {
                date = date || new Date;
                var m = date.getMonth();
                var d = date.getDate();
                var y = date.getFullYear();
                //var wn = date.getWeekNumber();
                var w = date.getDay();
                var s = {};
                var hr = date.getHours();
                var pm = (hr >= 12);
                var ir = (pm) ? (hr - 12) : hr;
                //var dy = date.getDayOfYear();
                if (ir == 0) { ir = 12; }
                var min = date.getMinutes();
                var sec = date.getSeconds();
                var parts = format.split(''), part;
                for (var i = 0; i < parts.length; i++) {
                    part = parts[i];
                    switch (parts[i]) {
                        case 'a': part = date.getDayName(); break;
                        case 'A': part = date.getDayName(true); break;
                        case 'b': part = date.getMonthName(); break;
                        case 'B': part = date.getMonthName(true); break;
                        case 'C': part = 1 + Math.floor(y / 100); break;
                        case 'd': part = (d < 10) ? ("0" + d) : d; break;
                        case 'e': part = d; break;
                        case 'H': part = (hr < 10) ? ("0" + hr) : hr; break;
                        case 'I': part = (ir < 10) ? ("0" + ir) : ir; break;
                        case 'j': part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy; break;
                        case 'k': part = hr; break;
                        case 'l': part = ir; break;
                        case 'm': part = (m < 9) ? ("0" + (1 + m)) : (1 + m); break;
                        case 'M': part = (min < 10) ? ("0" + min) : min; break;
                        case 'p': case 'P': part = pm ? "PM" : "AM"; break;
                        case 's': part = Math.floor(date.getTime() / 1000); break;
                        case 'S': part = (sec < 10) ? ("0" + sec) : sec; break;
                        case 'u': part = w + 1; break; case 'w': part = w; break;
                        case 'y': part = ('' + y).substr(2, 2); break;
                        case 'Y': part = y; break;
                    }
                    parts[i] = part;
                }
                return parts.join('');
            },
            formatY_m_d = function (date) { return formatDate(date, 'Y-m-d') },
            formatZhY_m_d = function (date) { return formatDate(date, 'Y-m-d') },
            parseY_m_d = function (date) { return parseDate(date, 'Y-m-d'); },
            date = date,
            options = options,
            events = events,
            $elms = function () { },
            datepicker = $.extend({
                temp: {},
                status: {},
                selected: [],
                text: '',
                isEmpty: '',
                today: new Date(),
                begin: null, // 第一个日期框
                end: null, // 第二个日期框
                __construct: function () {
                    var that = this;
                    options = jQuery.extend({ calendars: 2, selection: 0 }, options);
                    that.temp.date = [];
                    that.temp.slct = [];
                    that.selected = [];
                    this.isEmpty = false;
                    var _date = [];
                    if (!date) { date = ''; }
                    if (date && $.type(date) == 'array') { _date = date; }
                    else { _date.push(date); }
                    if (_date[0]&&_date[0].constructor == Date) { _date[0] = formatY_m_d(_date[0]); }
                    else if (!/^[\d]{4}([\-][\d]{2}){2}$/.test(_date[0])) { _date[0] = ''; this.isEmpty = true; }
                    if (!this.isEmpty) { that.selected[0] = that.temp.date[0] = parseY_m_d(_date[0]); }
                    if (_date[1]) {
                        if (_date[0]&&_date[1].constructor == Date) { _date[1] = formatY_m_d(_date[1]); }
                        else if (!/^[\d]{4}([\-][\d]{2}){2}$/.test(_date[1])) { _date[1] = ''; this.isEmpty = true; }
                        if (!this.isEmpty) { that.selected[1] = that.temp.date[1] = parseY_m_d(_date[1]); }
                    }
                    if (_date[0] && _date[1] && _date[0] != _date[1]) { that.text = ' 从 ' + formatZhY_m_d(that.selected[0]) + ' 至 ' + formatZhY_m_d(that.selected[1]); }
                    else if (this.isEmpty) { that.text = title || '选择时间范围'; }
                    else { that.text = formatZhY_m_d(that.selected[0]); }
                    /*第一个日历控制为当前月 第二个日历控制为下个月*/
                    that.begin = new Date(that.today.getFullYear(), that.today.getMonth() + 0, 1);
                    that.end = new Date(that.today.getFullYear(), that.today.getMonth() + 1, 1);
                    if (!this.isEmpty) {
                        that.begin = new Date(that.selected[0].getFullYear(), that.selected[0].getMonth(), 1);
                        if (that.selected.length > 1) {
                            that.end = new Date(that.selected[1].getFullYear(), that.selected[1].getMonth(), 1);
                        }
                    }
                },
                datepicker: function () {
                    var that = this;
                    $elms = $.extend({
                        Datepicker: $('<div class="date-btn"></div>'),
                        DatepickerTextIcon: $('<div class="date-txt date-ico"></div>')
                    }, $elms);
                    $elms.Datepicker.empty();
                    $elms.Datepicker.append($elms.DatepickerTextIcon.text(that.text));
                },
                datepickerEvents: function () {
                    var that = this;
                    $elms.Datepicker.click(function (event) { that.datepickerHandlers.click(event); });
                    $elms.Datepicker.hover(function () {
                        if (!that.status.opening) { $elms.Datepicker.addClass('date-hover-btn'); }
                    }, function () {
                        $elms.Datepicker.removeClass('date-hover-btn');
                    });
                    $elms.Datepicker.attr('class', 'date-btn');
                },
                datepickerHandlers: {
                    setWidth: function () {
                        $this.css({ height: $elms.Datepicker.outerHeight() });
                    },
                    off: function () {
                        datepicker.init();
                        datepicker.status.opening = false;
                    },
                    ok: function () {
                        if (datepicker.temp.slct.length > 0) { date = datepicker.temp.slct; }
                        if (events && events.constructor == Function) { events(date); }
                        datepicker.init();
                    },
                    reset: function () {
                        date = '';
                        if (events && events.constructor == Function) { events(date); }
                        //datepicker.init();
                        datepicker.clearInit();
                    },
                    text: function (val) {
                        $elms.DatepickerTextIcon.empty();
                        $elms.DatepickerTextIcon.text(val);
                    },
                    click: function (event) {
                        if (!datepicker.status.opening) {
                            $elms.Datepicker.addClass('date-press-btn');
                            $elms.Datepicker.removeClass('date-hover-btn');
                            $elms.Calendars.show();
                            datepicker.calendarsHandlers.setWidth();
                            datepicker.status.opening = true;
                        }
                        else {
                            datepicker.datepickerHandlers.off();
                        }
                        $elms.Calendars.css({ position: 'absolute', 'margin-top': $elms.Datepicker.outerHeight() - 1, 'z-index': 100, 'margin-left': 0 });
                        $('body').one('click', datepicker.datepickerHandlers.off);
                        $(".dd_menu").fadeOut(100);
                        event.stopPropagation();
                    }
                },
                calendars: function (current) {
                    var that = this;
                    $elms = $.extend({
                        Calendar: [],
                        Calendars: $('<div class="calendars"></div>'),
                        Prev: [],
                        PrevYear: [],
                        NextYear: [],
                        Next: [],
                        Days: {}
                    }
                    ,$elms,
                    {
                        CalendarsFooter: $('<div class="calendars-footer"></div>'),
                        TodayButton:$('<a href="javascript:void(0)">今天</a>'),
                        YesterdayButton:$('<a href="javascript:void(0)">昨天</a>'),
                        beforeYesterdayButton:$('<a href="javascript:void(0)">前天</a>'),
                        Day7Button:$('<a href="javascript:void(0)">最近7天</a>'),
                        Day15Button:$('<a href="javascript:void(0)">最近15天</a>'),
                        MonthButton:$('<a style="margin-right:10px;" href="javascript:void(0)">最近一个月</a>'),
                        ThisMonthButton:$('<a href="javascript:void(0)">当月</a>'),
                        PrevMonthButton:$('<a style="margin-right:75px;" href="javascript:void(0)">上一月</a>'),
                        NextDay7Button:$('<a href="javascript:void(0)">未来7天</a>'),
                        NextDay15Button:$('<a href="javascript:void(0)">未来15天</a>'),
                        NextThisMonthButton:$('<a href="javascript:void(0)">当月</a>'),
                        NextMonthButton:$('<a style="margin-right:10px;" href="javascript:void(0)">未来一个月</a>'),
                        OkButton: $('<button type="button" class="submit-btn">确 定</button>'),
                        ClearButton: $('<button type="button" class="clear-btn">清 空</button>'),
                        CancelButton: $('<a href="javascript:void(0)" class="cancel-btn">取消</a>')
                    });
                    $elms.Calendars.empty();
                    if( current==1 && that.begin.getTime() >= that.end.getTime() ){
                        that.begin = new Date(that.end.getFullYear() , that.end.getMonth() - 1, 1);
                    }else if( /*current==0 && 初始化时候也用这里规范*/ that.begin.getTime() >= that.end.getTime() ){
                        that.end = new Date(that.begin.getFullYear() , that.begin.getMonth() + 1, 1);
                    }
                    var current = datepicker.temp.date;
                    var x1 = [that.begin.getFullYear(), that.begin.getMonth() + 0]
                    var x2 = [that.end.getFullYear(), that.end.getMonth() + 0]
                    that.calendar(new Date(x1[0], x1[1], 1), 0, options.calendars);
                    that.calendar(new Date(x2[0], x2[1], 1), 1, options.calendars);
                    if(options.showFuture){
                        $elms.CalendarsFooter
                            .append($elms.TodayButton)
                            .append($elms.NextDay7Button)
                            .append($elms.NextDay15Button)
                            .append($elms.NextThisMonthButton)
                            .append($elms.NextMonthButton)
                            .append($elms.OkButton)
                            .append($elms.ClearButton)
                            ;
                    }else{
                        $elms.CalendarsFooter
                            .append($elms.TodayButton)
                            .append($elms.Day7Button)
                            .append($elms.Day15Button)
                            .append($elms.ThisMonthButton)
                            .append($elms.MonthButton)
                            .append($elms.OkButton)
                            .append($elms.ClearButton)
                            ;
                    }
                    $elms.Calendars.append($elms.CalendarsFooter);
                    that.calendarsHandlers.selected(datepicker.temp.date);
                    that.calendarsEvens();
                },
                calendar: function (date, current, calendars) {
                    var that = this,
                        blocked = function (date) {
                            var blocked = [];
                            var offset = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
                            var last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                            var moreset = Math.ceil((offset + last) / 7) * 7 - (offset + last);
                            for (o = 0; o < offset; o++) { blocked.push(''); }
                            for (d = 0; d < last; d++) { blocked.push(d + 1); }
                            for (m = 0; m < moreset; m++) { blocked.push(''); }
                            return blocked;
                        },
                        $calendarTable = $('<table class="calendar-box"></table>'),
                        $calendarThead = $('<thead></thead>'),
                        $calendarTbody = $('<tbody></tbody>'),
                        $calendarCurrent = $('<th colspan="3"></th>'),
                        $calendarMenu = $('<tr class="calendar-menu"></tr>'),
                        $calendarWeeks = $('<tr class="calendar-weeks"></tr>');
                    $elms.Calendar[current] = $('<div class="calendar"></div>');
                    $elms.Calendars.append($elms.Calendar[current]);
                    $elms.Calendar[current].append($calendarTable);
                    $calendarTable.append($calendarThead);
                    $calendarTable.append($calendarTbody);
                    $calendarThead.append($calendarMenu);
                    $calendarThead.append($calendarWeeks.html('<th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>'));
                    $elms.Prev[current] = $('<th class="calendar-change calendar-prev"><span style="font-family:serif,sim-sun,tahoma;font-size: 12px;float: none;">&lt;</span></th>');
                    $elms.PrevYear[current] = $('<th class="calendar-change calendar-prev"><span style="font-family:serif,sim-sun,tahoma;font-size: 12px;float: none;">&lt;&lt;</span></th>');
                    $elms.Next[current] = $('<th class="calendar-change calendar-next"><span style="font-family:serif,sim-sun,tahoma;font-size: 12px;float: none;">&gt;</span></th>');
                    $elms.NextYear[current] = $('<th class="calendar-change calendar-next"><span style="font-family:serif,sim-sun,tahoma;font-size: 12px;float: none;">&gt;&gt;</span></th>');
                    $calendarMenu.append($elms.PrevYear[current]);
                    $calendarMenu.append($elms.Prev[current]);
                    $calendarMenu.append($calendarCurrent.text(formatDate(date, 'Y年m月')));
                    $calendarMenu.append($elms.Next[current]);
                    $calendarMenu.append($elms.NextYear[current]);
                    t = 0,
                    $tr = [],
                    blockedArray = blocked(date);
                    $.each(blockedArray, function (i, day) {
                        if (i % 7 == 0) {
                            $tr.push($('<tr></tr>'));
                            $calendarTbody.append($tr[t]);
                        }
                        if (day) {
                            id = formatDate(date, 'Y-m-') + _pad(day, 2);
                            if (parseY_m_d(id) > new Date()) {
                                //$elms.Days[id] = $('<td class="calendar-day-disable">' + _pad(day, 2) + '</td>');
                                $elms.Days[id] = $('<td class="calendar-day">' + _pad(day, 2) + '</td>');
                                $tr[t].append($elms.Days[id]);
                            }
                            else {
                                $elms.Days[id] = $('<td class="calendar-day">' + _pad(day, 2) + '</td>');
                                $tr[t].append($elms.Days[id]);
                            }
                        }
                        else {
                            $tr[t].append('<td class="none-day"></td>');
                        }
                        if (i % 7 == 6) {
                            t++;
                        }
                    });
                },
                calendarsEvens: function () {
                    var that = this;
                    $elms.CancelButton.click(that.datepickerHandlers.off);
                    $elms.OkButton.click(that.datepickerHandlers.ok);
                    // $("#btnchange").click(that.datepickerHandlers.ok);
                    $elms.ClearButton.click(that.datepickerHandlers.reset);
                    $elms.TodayButton.click(function(){
                        that.calendarsHandlers.setDay();
                        that.datepickerHandlers.ok();
                    });
                    $elms.YesterdayButton.click(function(){
                        that.calendarsHandlers.setDay(0,1);
                        that.datepickerHandlers.ok();
                    });
                    $elms.beforeYesterdayButton.click(function(){
                        that.calendarsHandlers.setDay(0,2);
                        that.datepickerHandlers.ok();
                    });
                    $elms.Day7Button.click(function(){
                        that.calendarsHandlers.setDay(0,0,6);
                        that.datepickerHandlers.ok();
                    });
                    $elms.Day15Button.click(function(){
                        that.calendarsHandlers.setDay(0,0,14);
                        that.datepickerHandlers.ok();
                    });
                    $elms.MonthButton.click(function(){
                        that.calendarsHandlers.setDay(1);
                        that.datepickerHandlers.ok();
                    });
                    $elms.ThisMonthButton.click(function(){
                        that.calendarsHandlers.setMonth(0);
                        that.datepickerHandlers.ok();
                    });
                    $elms.PrevMonthButton.click(function(){
                        that.calendarsHandlers.setMonth(1);
                        that.datepickerHandlers.ok();
                    });
                    $elms.NextDay7Button.click(function(){
                        that.calendarsHandlers.setDayNext(0,0,6);
                        that.datepickerHandlers.ok();
                    });
                    $elms.NextDay15Button.click(function(){
                        that.calendarsHandlers.setDayNext(0,0,14);
                        that.datepickerHandlers.ok();
                    });
                    $elms.NextThisMonthButton.click(function(){
                        that.calendarsHandlers.setMonthNext(0);
                        that.datepickerHandlers.ok();
                    });
                    $elms.NextMonthButton.click(function(){
                        that.calendarsHandlers.setDayNext(1);
                        that.datepickerHandlers.ok();
                    });

                    $.each($elms.Days, function (id, $day) {
                        $day.click(function () { that.calendarsHandlers.click(id, $day) });
                    });
                    $.each($elms.Prev, function (current, $prev) {
                        $prev.click(function () { that.calendarsHandlers.prev(current) });
                    });
                    //上一年
                    $.each($elms.PrevYear, function (current, $prev) {
                        $prev.click(function () { that.calendarsHandlers.prevYear(current) });
                    });
                    $.each($elms.Next, function (current, $next) {
                        $next.click(function () { that.calendarsHandlers.next(current) });
                    });
                    //下一年
                    $.each($elms.NextYear, function (current, $next) {
                        $next.click(function () { that.calendarsHandlers.nextYear(current) });
                    });
                    $elms.Calendars.click(function (event) { event.stopPropagation(); });
                },
                calendarsHandlers: {
                    setWidth: function () {
                        $elms.Calendars.width($elms.Calendar[0].outerWidth() * options.calendars);
                    },
                    selected: function (date) {
                        var date0 = date[0];
                        var date1 = (date[1]) ? date[1] : date[0];
                        var todayY_m_d = formatY_m_d(datepicker.today);
                        var date0Y_m_d = formatY_m_d(date0);
                        var date1Y_m_d = formatY_m_d(date1);
                        $.each($elms.Days, function (id, $day) {
                            $day.removeClass('select-day today select-first-day select-last-day');
                            if (id == todayY_m_d) { $day.addClass('today'); }
                            if (date0 && id >= date0Y_m_d && id <= date1Y_m_d) {
                                $day.addClass('select-day');
                                if(id == date0Y_m_d){$day.addClass('select-first-day');}
                                else if(id == date1Y_m_d){$day.addClass('select-last-day');}
                            }
                        });
                    },
                    click: function (id, $day) {
                        //if (parseY_m_d(id) > new Date()) return;
                        if (!datepicker.status.selecting) {
                            datepicker.temp.date = [];
                            datepicker.temp.date[0] = parseY_m_d(id);
                            datepicker.temp.slct[0] = id;
                            datepicker.calendarsHandlers.selected([datepicker.temp.date[0]]);
                            datepicker.status.selecting = true;
                            datepicker.text = formatZhY_m_d(datepicker.temp.date[0]);
                        }
                        else {
                            datepicker.temp.date[1] = parseY_m_d(id);
                            if (datepicker.temp.date[0] == datepicker.temp.date[1]) {
                                datepicker.temp.date[0] = [datepicker.temp.date[1]];
                            }
                            if (datepicker.temp.date[0] > datepicker.temp.date[1]) {
                                datepicker.calendarsHandlers.selected([
                                    datepicker.temp.date[1],
                                    datepicker.temp.date[0]
                                ]);
                                datepicker.temp.slct = [id, datepicker.temp.slct[0]];
                                datepicker.text = '从 ' + formatZhY_m_d(datepicker.temp.date[1]) + ' 至 ' + formatZhY_m_d(datepicker.temp.date[0]);
                            }
                            else {
                                datepicker.calendarsHandlers.selected([
                                    datepicker.temp.date[0],
                                    datepicker.temp.date[1]
                                ]);
                                datepicker.temp.slct = [datepicker.temp.slct[0], id];
                                datepicker.text = '从 ' + formatZhY_m_d(datepicker.temp.date[0]) + ' 至 ' + formatZhY_m_d(datepicker.temp.date[1]);
                            }
                            datepicker.status.selecting = false;
                        }
                        datepicker.datepickerHandlers.text(datepicker.text);
                    },
                    //把当前操作的内容 下标拿过来
                    //区分对待b
                    prev: function (current) {
                        if(current==1){ datepicker.end = new Date(datepicker.end.getFullYear(), datepicker.end.getMonth() - 1, 1); }
                        else{ datepicker.begin = new Date(datepicker.begin.getFullYear(), datepicker.begin.getMonth() - 1, 1); }
                        datepicker.calendars(current);
                    },
                    prevYear: function (current) {
                        if(current==1){ datepicker.end = new Date(datepicker.end.getFullYear() - 1, datepicker.end.getMonth(), 1); }
                        else{ datepicker.begin = new Date(datepicker.begin.getFullYear() - 1, datepicker.begin.getMonth(), 1); }
                        datepicker.calendars(current);
                    },
                    next: function (current) {
                        if(current==1){ datepicker.end = new Date(datepicker.end.getFullYear(), datepicker.end.getMonth() + 1, 1); }
                        else{ datepicker.begin = new Date(datepicker.begin.getFullYear(), datepicker.begin.getMonth() + 1, 1); }
                        datepicker.calendars(current);
                    },
                    nextYear: function (current) {
                        if(current==1){ datepicker.end = new Date(datepicker.end.getFullYear() + 1, datepicker.end.getMonth(), 1); }
                        else{ datepicker.begin = new Date(datepicker.begin.getFullYear() + 1, datepicker.begin.getMonth(), 1); }
                        datepicker.calendars(current);
                    },
                    setDay:function(month,bday,eday){
                        datepicker.temp.slct = [];
                        datepicker.status.selecting = false;
                        var bDate = new Date();
                        if(bday&&bday>0)
                            bDate.setDate(bDate.getDate()-bday);
                        datepicker.calendarsHandlers.click(formatY_m_d(bDate),null);
                        var to = bDate;
                        if(month&& month>0){
                            to.setMonth(to.getMonth() - month);
                            to.setDate(to.getDate() + 1);
                            datepicker.calendarsHandlers.click(formatY_m_d(to),null);
                        }else if(eday&&eday>0){
                            to.setDate(to.getDate() - eday);
                            datepicker.calendarsHandlers.click(formatY_m_d(to),null);
                        };
                    },
                    setDayNext:function(month,bday,eday){
                        datepicker.temp.slct = [];
                        datepicker.status.selecting = false;
                        var bDate = new Date();
                        if(bday&&bday>0)
                            bDate.setDate(bDate.getDate() + bday);
                        datepicker.calendarsHandlers.click(formatY_m_d(bDate),null);
                        var to = bDate;
                        if(month&& month>0){
                            to.setMonth(to.getMonth() + month);
                            to.setDate(to.getDate() + 1);
                            datepicker.calendarsHandlers.click(formatY_m_d(to),null);
                        }else if(eday&&eday>0){
                            to.setDate(to.getDate() + eday);
                            datepicker.calendarsHandlers.click(formatY_m_d(to),null);
                        };
                    },
                    setMonth:function(month){
                        datepicker.temp.slct = [];
                        datepicker.status.selecting = false;
                        var bDate = new Date();
                        if(month){
                            bDate = new Date(bDate.getFullYear(), bDate.getMonth() - month + 1, 1);
                            bDate = new Date(bDate.getTime()-1000*60*60*24);
                        }
                        datepicker.calendarsHandlers.click(formatY_m_d(bDate),null);
                        var to = bDate;
                        to.setDate(1);
                        datepicker.calendarsHandlers.click(formatY_m_d(to),null);
                    },
                    setMonthNext:function(month){
                        datepicker.temp.slct = [];
                        datepicker.status.selecting = false;
                        var bDate = new Date();
                        datepicker.calendarsHandlers.click(formatY_m_d(bDate),null);
                        var to = bDate;
                        function _Date_daysInMonth(D) {
                            var D = D||new Date();curMonth = D.getMonth();
                            D.setDate(1);D.setMonth(curMonth+1);D.setDate(0);
                            return D.getDate();
                        }
                        to.setDate(_Date_daysInMonth(to));
                        datepicker.calendarsHandlers.click(formatY_m_d(to),null);
                    }
                },
                clearInit: function () {
                    var that = this;
                    that.status.opening = false;
                    that.status.selecting = false;
                    that.__construct();
                    $this.empty();
                    that.datepicker();
                    that.datepickerEvents();
                    that.calendars();
                    //$elms.Calendars.hide();
                    $this.append($elms.Datepicker);
                    $this.append($elms.Calendars);
                    $this.addClass('datepicker');
                    that.datepickerHandlers.setWidth();
                },
                init: function () {
                    var that = this;
                    that.status.opening = false;
                    that.status.selecting = false;
                    that.__construct();
                    $this.empty();
                    that.datepicker();
                    that.datepickerEvents();
                    that.calendars();
                    $elms.Calendars.hide();
                    $this.append($elms.Datepicker);
                    $this.append($elms.Calendars);
                    $this.addClass('datepicker');
                    that.datepickerHandlers.setWidth();
                }
            }, function () { });
            datepicker.init();
        }
    });
})(jQuery);
