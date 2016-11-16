(function($) {
    var App = {
        init: function() {
            if ( $.restive.isNonMobile() ) {
                App.inputSelect2();
            }
            App.avaibilityChange();
            App.topMenu();
            App.profileNav();
            App.modal();
        },

        inputSelect2: function() {
            var select = $("select.Input--clickable");
            if(select.html() && select.children("option").html() && select.children("option")[0].value)
            {
                var opt = $('<option></option>',{value:'', selected:'selected'});
                select.prepend(opt);
            }
            $.fn.select2.defaults.set("minimumResultsForSearch", "Infinity");
            $.fn.select2.defaults.set("width", "100%");
            $.fn.select2.defaults.set("placeholder", "Select an option");
            select.select2({});
        },

        avaibilityChange: function() {
            var avaibility = $('.CardProfile__avaibility');
            if(avaibility.html())
            {
                var dropdown = $('.Dropdown');
                var dropdownOpt = $('.Dropdown__option');
                avaibility.click(function(){
                    dropdown.toggleClass('Dropdown--open');
                });
                dropdownOpt.click(function(){
                    var value = $(this).attr('data-value');
                    var icon = $(this).attr('data-icon');
                    var text = $('.CardProfile__avaibility-text');
                    var status = $('.CardProfile__status');
                    dropdown.toggleClass('Dropdown--open');
                    if(value && icon)
                    {
                        text.html(value);
                        status.attr('src',icon);
                    }
                });
            }
        },

        topMenu: function() {
            var profile = $('.TopNavigation__profile');
            var menu = $('.TopMenu');
            // profile.click(function(){
            //     menu.toggleClass('TopMenu--is-hidden');
            // });
            profile.attr('data-target', '.TopMenu').dropdown({toggleClass:'--is-hidden'});
        },

        profileNav: function() {
            var nav = $('.ProfileNav__nav');
            var navContent = $('.ProfileNav__nav-content');
            if(nav.html())
            {
                nav.click(function(){
                    if(!$(this).hasClass('ProfileNav__nav--active'))
                    {
                        nav.removeClass('ProfileNav__nav--active');
                        navContent.removeClass('ProfileNav__nav-content--active');
                        $(this).addClass('ProfileNav__nav--active');
                        var content = $(this).attr('data-content');
                        if(content && content[0] !== '#' && content[0] !== '.')
                        {
                            content = "#" + content;
                        }
                        $(content).addClass('ProfileNav__nav-content--active');
                    }
                });
            }
        },

        modal: function() {
            var modal = $('[data-toggle="modal"]');
            var close = $('[data-dismiss="modal"]');
            modal.each(function(){
                var target = $(this).attr('data-target');
                if(target && target[0] !== '#' && target[0] !== '.')
                {
                    target = "#" + target;
                }
                modal.click(function(){
                    if(!$('div').hasClass('Overlay'))
                    {
                        var overlay = $('<div></div>',{class:'Overlay'});
                        $('body').append(overlay);
                        overlay.click(function() {
                            close.trigger('click');
                        });
                    }
                    $(target).addClass('Modal--show');
                });

                close.click(function(){
                    $(this).parents(target).removeClass('Modal--show');
                });
            });

            $('.Overlay').click(function() {
                $('.Modal--show').removeClass('Modal--show');
            });
        },
    };

    $.fn.modal = function( option ) {
        var close = $('[data-dismiss="modal"]');
        if(typeof(option) === 'undefined')
        {
            option = "show";
        }
        var target = $(this).attr('data-target');
        if(target && target[0] !== '#' && target[0] !== '.')
        {
            target = "#" + target;
        }
        if(!$('div').hasClass('Overlay'))
        {
            var overlay = $('<div></div>',{class:'Overlay'});
            $('body').append(overlay);
            overlay.click(function() {
                $(target).removeClass('Modal--show');
            });
        }
        switch(option){
            case 'show':
                $(target).addClass('Modal--show');
                break;
            case 'hide':
                $(target).removeClass('Modal--show');
                break;
            case 'toggle':
                $(target).toggleClass('Modal--show');
                break;
            default: console.log("Modal function only accept toggle/show/hide");
            break;
        }
        return this;
    };

    $.fn.dropdown = function( options ) {
        var settings = $.extend({
            toggleClass: "--show"
        }, options );

        $(this).click(function(){
            var target = $(this).attr('data-target');
            if(target && target[0] !== '#' && target[0] !== '.')
            {
                target = "#" + target;
            }
            var toggle = target.substring(1);
            if (settings.toggleClass.search(toggle) >= 0){
                toggle = settings.toggleClass;
            }else{
                toggle = toggle + settings.toggleClass;
            }
            //console.log(target);
            $(target).toggleClass(toggle);
        });
        return this;
    };

    $(function() {
        App.init();
    });
})(jQuery);