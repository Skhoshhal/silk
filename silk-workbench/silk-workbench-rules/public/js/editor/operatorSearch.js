'use strict';

// filtering of operator list based on search term

(function () {
    var lastSearch = null;

    function makeSearchResultDraggable($elem) {
        if ($elem.hasClass('drag-initialized')) {
            return;
        }

        $elem.addClass('drag-initialized');
        $elem.find('.draggable').draggable({
            helper: function helper() {
                var box = $(this).children('.dragDiv');
                box.show();
                return box;
            },
            stop: function stop(event, ui) {
                ui.helper.hide();
                $.ui.ddmanager.current.cancelHelperRemoval = true;
            }
        });
    }

    function operatorSearchFn() {
        var searchTerm = $(this).val().toLocaleLowerCase();
        if (searchTerm === '') {
            // show regular grouped view if search term empty
            $('#operators-grouped').show();
            $('#operators-search-result').hide();
        } else {
            // show ungrouped list of operators if we have a non-empty search term
            $('#operators-grouped').hide();
            $('#operators-search-result').show();

            var $operatorList = $('#operatorList');

            $('#at_least_two_alert').hide();

            var match = 0;

            var operators = $operatorList.find('.operator');

            if (_.startsWith(searchTerm, lastSearch)) {
                operators = operators.filter(':not(.search-invisible)');
            }

            operators.each(function () {
                var $elem = $(this);

                if (match >= 50) {
                    $elem.addClass('search-invisible');
                    return;
                }

                // the operator's index terms to match against
                var text = $elem.find('.operator-index').text().toLocaleLowerCase();

                if (text.indexOf(searchTerm) >= 0) {
                    $elem.removeClass('search-invisible');
                    match += 1;
                    generateNewIdsForTooltips($elem);
                    activateDeferredMDL($elem);
                    makeSearchResultDraggable($elem);
                    var $label = $elem.find('p.non-breaking-label');
                    $label.unmark();
                    $label.mark(searchTerm);
                } else {
                    $elem.addClass('search-invisible');
                }
            });

            var $noMatch = $('#no_match_alert');

            if (match > 0) {
                $noMatch.hide();
            } else {
                $noMatch.show();
            }

            var maxMatch = $('#max_results_alert');

            if (match < 50) {
                maxMatch.hide();
            } else {
                maxMatch.show();
            }

            lastSearch = searchTerm;
        }
    }

    $('#operator_search_term').keyup(_.debounce(operatorSearchFn, 300));
})();
