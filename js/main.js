/**
 * لجنة زكاة كفر طنبدي - jQuery Interactive Scripts
 */
$(document).ready(function () {

    // 1. Toggle Header Search Bar
    $('#searchToggleBtn').on('click', function () {
        $('#headerSearchBar').slideToggle(200, function () {
            if ($(this).is(':visible')) {
                $(this).find('input').trigger('focus');
            }
        });
    });

    $('#searchForm').on('submit', function (e) {
        e.preventDefault();
        var query = $(this).find('input').val().trim();
        if (query) {
            $('#headerSearchBar').slideUp(200);
        }
    });

    // 2. Active Navigation Link on Click & Smooth Scroll
    $('.navbar-nav .nav-link').on('click', function (e) {
        var targetHash = $(this).attr('href');
        if (targetHash && targetHash.startsWith('#') && $(targetHash).length) {
            e.preventDefault();
            $('.navbar-nav .nav-link').removeClass('active');
            $(this).addClass('active');

            $('html, body').animate({
                scrollTop: $(targetHash).offset().top - 75
            }, 500);

            // Close mobile menu if open
            var navbarCollapse = $('#mainNav');
            if (navbarCollapse.hasClass('show')) {
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse[0]).hide();
            }
        }
    });

    // 3. Selectable Contribution Tiles (طرق المساهمة)
    $('.contribute-option-tile').on('click', function () {
        $('.contribute-option-tile').removeClass('active');
        $(this).addClass('active');
        var selectedType = $(this).data('contribute');
        $('#startContributeBtn').attr('data-type', selectedType);
    });

    // 4. Open Donate Modal with Selected Category
    $(document).on('click', '.open-donate-modal', function () {
        var type = $(this).attr('data-type') || 'الصدقات';
        var presetAmount = $(this).attr('data-amount') || '';
        $('#donateModalType').text(type);
        $('#donateCategorySelect').val(type);
        $('#donateSuccessMsg').addClass('d-none');
        $('#donateForm')[0].reset();
        $('#donateCategorySelect').val(type);
        if (presetAmount) {
            $('#donateForm input[type="number"]').val(presetAmount);
        }
        var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('donateModal'));
        modal.show();
    });

    // 4b. Zakat Guide Interactive Tabs & Quick Zakat Calculator (2.5%)
    $('.zakat-tab-btn').on('click', function () {
        $('.zakat-tab-btn').removeClass('active');
        $(this).addClass('active');
        var target = $(this).data('target');

        $('.zakat-panel').hide();
        $('#' + target).stop(true, true).fadeIn(220);
    });

    $('.switch-to-channels-tab').on('click', function () {
        $('.zakat-tab-btn[data-target="zakat-channels"]').trigger('click');
    });

    function normalizeNumberString(str) {
        if (!str) return '';
        var arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        var clean = str.toString();
        for (var i = 0; i < 10; i++) {
            clean = clean.replace(new RegExp(arabicDigits[i], 'g'), i);
        }
        clean = clean.replace(/[,،\s]/g, '');
        return clean;
    }

    function calculateZakatNow(highlightEffect) {
        var rawVal = $('#zakatAmountInput').val();
        var normalized = normalizeNumberString(rawVal);
        var amount = parseFloat(normalized);
        var rate = parseFloat($('#zakatRateSelect').val()) || 0.025;
        var ratePercent = (rate * 100).toFixed(rate === 0.025 ? 1 : 0) + '%';

        if (!isNaN(amount) && amount > 0) {
            var zakatDue = Math.round(amount * rate * 100) / 100;
            $('#zakatCalculatedVal').text(formatNumberWithCommas(zakatDue) + ' ج.م');
            $('#zakatFormulaNote')
                .removeClass('text-danger')
                .addClass('text-emerald fw-semibold')
                .text('حساب الزكاة: ' + formatNumberWithCommas(amount) + ' ج.م × ' + ratePercent + ' = ' + formatNumberWithCommas(zakatDue) + ' ج.م');
            $('.calc-result-strip').addClass('calculated-active');
            $('#payCalculatedZakatBtn').attr('data-amount', Math.ceil(zakatDue));

            if (highlightEffect) {
                $('.calc-result-strip').fadeOut(90).fadeIn(180);
            }
        } else {
            $('#zakatCalculatedVal').text('0 ج.م');
            $('.calc-result-strip').removeClass('calculated-active');
            $('#payCalculatedZakatBtn').removeAttr('data-amount');
            if (highlightEffect) {
                $('#zakatFormulaNote')
                    .removeClass('text-emerald')
                    .addClass('text-danger fw-semibold')
                    .text('يرجى إدخال قيمة المبلغ أولاً لحساب الزكاة');
                $('#zakatAmountInput').trigger('focus');
            } else {
                $('#zakatFormulaNote')
                    .removeClass('text-danger text-emerald fw-semibold')
                    .addClass('text-muted')
                    .text('أدخل المبلغ لحساب الزكاة تلقائياً');
            }
        }
    }

    $(document).on('input keyup change', '#zakatAmountInput', function () {
        calculateZakatNow(false);
    });

    $(document).on('change', '#zakatRateSelect', function () {
        var label = $(this).find('option:selected').data('label') || 'ربع العشر 2.5%';
        $('#zakatRateSubtitle').text('احسب مقدار زكاتك الشرعية (' + label + ')');
        calculateZakatNow(true);
    });

    $(document).on('click', '#calcZakatActionBtn', function () {
        calculateZakatNow(true);
    });

    $('#zakatAmountInput').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            calculateZakatNow(true);
        }
    });

    // 4c. Copy Account/Wallet Number in Donation Methods Section
    $(document).on('click', '.btn-copy-data', function () {
        var $btn = $(this);
        var textToCopy = $btn.data('copy');
        if (navigator.clipboard && textToCopy) {
            navigator.clipboard.writeText(textToCopy.toString());
        }
        $btn.addClass('copied').html('<i class="fa-solid fa-check"></i>');
        setTimeout(function () {
            $btn.removeClass('copied').html('<i class="fa-regular fa-copy"></i>');
        }, 1600);
    });

    $('#donateForm').on('submit', function (e) {
        e.preventDefault();
        $('#donateSuccessMsg').removeClass('d-none').hide().fadeIn(300);
    });

    // 5. Open Electronic Help Request Modal
    $(document).on('click', '.open-help-modal', function () {
        $('#helpSuccessMsg').addClass('d-none');
        $('#helpRequestForm')[0].reset();
        var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('helpRequestModal'));
        modal.show();
    });

    $('#helpRequestForm').on('submit', function (e) {
        e.preventDefault();
        $('#helpSuccessMsg').removeClass('d-none').hide().fadeIn(300);
    });

    // 6. Service Details & About Committee Modal
    var currentServiceTitle = 'الصدقات';
    $('.open-service-detail').on('click', function (e) {
        e.preventDefault();
        currentServiceTitle = $(this).data('title');
        var desc = $(this).data('desc');
        $('#infoModalTitle').text(currentServiceTitle);
        $('#infoModalDesc').text(desc);
        var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('infoModal'));
        modal.show();
    });

    $('.open-about-modal').on('click', function () {
        currentServiceTitle = 'تبرع عام';
        $('#infoModalTitle').text('عن لجنة زكاة كفر طنبدي');
        $('#infoModalDesc').text(
            'لجنة زكاة كفر طنبدي هي لجنة خيرية رسمية مرخصة من بنك ناصر الاجتماعي برقم (4859/3)، ' +
            'تعمل تحت إشراف الأستاذ علي دواد المحامي وبمشاركة نخبة من أهل القرية لتوصيل أموال الزكاة والصدقات ' +
            'والقروض الحسنة والتبرعات العينية لمستحقيها وفق الضوابط الشرعية وبما يحفظ كرامة الأسر.'
        );
        var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('infoModal'));
        modal.show();
    });

    $('.open-donate-from-info').on('click', function () {
        bootstrap.Modal.getInstance(document.getElementById('infoModal')).hide();
        $('#donateModalType').text(currentServiceTitle);
        var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('donateModal'));
        modal.show();
    });

    // 7. Recent Works Slider Navigation (من أعمالنا الأخيرة)
    $('#workNextBtn').on('click', function () {
        var $container = $('#worksSliderContainer');
        var $first = $container.children('.work-slide-col').first();
        $first.fadeOut(180, function () {
            $container.append($first);
            $first.fadeIn(180);
        });
    });

    $('#workPrevBtn').on('click', function () {
        var $container = $('#worksSliderContainer');
        var $last = $container.children('.work-slide-col').last();
        $last.fadeOut(180, function () {
            $container.prepend($last);
            $last.fadeIn(180);
        });
    });

    // 8. Animated Number Counters on Scroll (أثر عطائك بالأرقام)
    var countersAnimated = false;

    function formatNumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function runCountersIfVisible() {
        if (countersAnimated) return;
        var $statsSection = $('#stats');
        if ($statsSection.length === 0) return;

        var windowBottom = $(window).scrollTop() + $(window).height();
        var sectionTop = $statsSection.offset().top + 60;

        if (windowBottom >= sectionTop) {
            countersAnimated = true;
            $('.counter-val').each(function () {
                var $this = $(this);
                var target = parseInt($this.data('target'), 10);
                var useComma = $this.data('comma') === true || $this.attr('data-comma') === 'true';

                $({ countNum: 0 }).animate(
                    { countNum: target },
                    {
                        duration: 1600,
                        easing: 'swing',
                        step: function () {
                            var val = Math.floor(this.countNum);
                            $this.text(useComma ? formatNumberWithCommas(val) : val);
                        },
                        complete: function () {
                            $this.text(useComma ? formatNumberWithCommas(target) : target);
                        }
                    }
                );
            });
        }
    }

    $(window).on('scroll resize', runCountersIfVisible);
    runCountersIfVisible();
});

