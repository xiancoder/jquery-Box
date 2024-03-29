/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Develer S.r.L.
 *
 * modify by liuyp
 */

/* global $ */
/* global angular */
/* global jQuery */

angular.module('angular-flot', []).directive('flot', ['$timeout', '$ocLazyLoad', 'MODULE_CONFIG', function ($timeout, $ocLazyLoad, MODULE_CONFIG) {
    return {
        restrict: 'EA',
        template: '<div></div>',
        scope: {
            dataset: '=',
            options: '=',
            callback: '=',
            onPlotClick: '&',
            onPlotHover: '&',
            onPlotSelected: '&',
            onPlotUnselected: '&'
        },
        link: function (scope, element, attributes) {
            $ocLazyLoad.load(MODULE_CONFIG['flot'][0]).then(function() {
            $ocLazyLoad.load(MODULE_CONFIG['flot']).then(function() {
                ///////////////////////////////////////////////////////
                    var plot = null;
                    var width = attributes.width || '100%';
                    var height = attributes.height || '100%';

                    // Bug: Passing a jQuery object causes an infinite loop within Angular. Fail hard telling
                    // users that they should pass us a jQuery expression as string instead.
                    if ((((scope.options || {}).legend || {}).container) instanceof jQuery) {
                        throw new Error('Please use a jQuery expression string with the "legend.container" option.');
                    }

                    if (!scope.dataset) {
                        scope.dataset = [];
                    }

                    if (!scope.options) {
                        scope.options = {
                            legend: {
                                show: false
                            }
                        };
                    }

                    var plotArea = $(element.children()[0]);

                    plotArea.css({
                        width: width,
                        height: height
                    });

                    var init = function () {
                        var plotObj = $.plot(plotArea, scope.dataset, scope.options);

                        if (scope.callback) {
                            scope.callback(plotObj);
                        }

                        return plotObj;
                    };

                    //
                    // Events
                    //

                    plotArea.on('plotclick', function onPlotClick (event, pos, item) {
                        $timeout(function onApplyPlotClick () {
                            scope.onPlotClick({
                                event: event,
                                pos: pos,
                                item: item
                            });
                        });
                    });

                    plotArea.on('plotselected', function onPlotSelected (event, ranges) {
                        $timeout(function onApplyPlotSelected () {
                            scope.onPlotSelected({
                                event: event,
                                ranges: ranges
                            });
                        });
                    });
                    
                    plotArea.on('plotunselected', function onPlotUnselected (event) {
                        $timeout(function onApplyPlotUnselected () {
                            scope.onPlotUnselected({
                                event: event
                            });
                        });
                    });

                    plotArea.on('plothover', function onPlotHover (event, pos, item) {
                        $timeout(function onApplyPlotHover () {
                            scope.onPlotHover({
                                event: event,
                                pos: pos,
                                item: item
                            });
                        });
                    });

                    //
                    // Watches
                    //

                    var onOptionsChanged = function () {
                        plot = init();
                    };

                    var unwatchOptions = scope.$watch('options', onOptionsChanged, true);

                    var onDatasetChanged = function (dataset) {
                        if (plot) {
                            plot.setData(dataset);
                            plot.setupGrid();

                            return plot.draw();
                        } else {
                            plot = init();
                        }
                    };

                    var unwatchDataset = scope.$watch('dataset', onDatasetChanged, true);

                    attributes.$observe('width', function (value) {
                        if (!value) return;
                        width = value;
                        plotArea.css('width', value);
                    });

                    attributes.$observe('height', function (value) {
                        if (!value) return;
                        height = value;
                        plotArea.css('height', value);
                    });

                    //
                    // Tear Down
                    //

                    element.on('$destroy', function onDestroy () {
                        plotArea.off('plotclick');
                        plotArea.off('plothover');
                        plotArea.off('plotselected');
                        plotArea.off('unplotselected');

                        plot.destroy();
                        unwatchDataset();
                        unwatchOptions();
                    });
                /////////////////////////////////////////
            console.log("Success: load flot libs ") })
            }).catch(function() { throw "Error: please inject flot libs!" })
        }
    };
}]);
