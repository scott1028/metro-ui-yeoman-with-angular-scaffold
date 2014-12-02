'use strict';

/**
 * @ngdoc function
 * @name appWordingEditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appWordingEditorApp
 */
angular.module('appWordingEditorApp')
  .controller('MainCtrl', function ($scope) {
    // 
    var reader = new FileReader();

    // 
    reader.onload = function(e) { 
        var contents = e.target.result;
        $scope.xml = xml_update_and_output(contents);
        // var register = [];
        var string_tag_list = $scope.xml.querySelectorAll('string[name]');
        for(var idx=0; idx < string_tag_list.length; idx++){
            var elm = string_tag_list[idx];
            var name = elm.getAttribute('name');
            var value = elm.textContent;

            $scope.xml_string_tag_store.push({
                name: name,
                value: value
            });
        };
        $scope.$apply();
    };

    // 
    var xml_update_and_output = function (text){
        // XML Parser
        var dom_parser=new DOMParser();
        var xmlDoc=dom_parser.parseFromString(text,"text/xml");
        // console.debug(xmlDoc);
        var wordings = xmlDoc.querySelectorAll('string[name]');
        // console.debug(wordings);
        var xml_parser = new XMLSerializer();
        var xml_string = xml_parser.serializeToString(xmlDoc);
        return xmlDoc
    };

    // 
    $scope.input_file = null;
    $scope.file_name = null;
    $scope.xml = null;
    $scope.xml_string_tag_store = [];

    // 
    $scope.open_file = function(){
        angular.element('#input_file').click();
    };

    // 
    $scope.$watch('input_file', function(new_value, old_value){
        // 
        if(new_value && new_value.name){
            $scope.file_name = new_value.name;
        };

        // 
        if(new_value){
            reader.readAsText(new_value);
        }
    }, true);
  });
