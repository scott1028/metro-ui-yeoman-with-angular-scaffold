'use strict';

/**
 * @ngdoc directive
 * @name appWordingEditorApp.directive:fileModel
 * @description
 * # fileModel
 */
angular.module('appWordingEditorApp')
    .directive('fileModel', ['$parse',
        function($parse) {
            // refer to http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function() {
                        scope.$apply(function() {
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }
    ])
