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
        $scope.xml = xml_update_and_output(contents).xml;
        var string_tag_list = $scope.xml.querySelectorAll('string[name]');
        for(var idx=0; idx < string_tag_list.length; idx++){
            var elm = string_tag_list[idx];
            var name = elm.getAttribute('name');
            var value = elm.textContent;

            $scope.xml_string_tag_store.push({
                name: name,
                value: value.replace(/\\n/g, '\n')
            });
        };
        $scope.$apply();
    };

    // 
    var xml_update_and_output = function (text){
        // XML Parser
        var dom_parser=new DOMParser();
        var xml_doc=dom_parser.parseFromString(text,"text/xml");
        // console.debug(xmlDoc);
        var wordings = xml_doc.querySelectorAll('string[name]');
        // console.debug(wordings);
        var xml_parser = new XMLSerializer();
        var xml_string = xml_parser.serializeToString(xml_doc);
        return {
            xml: xml_doc,
            data: xml_string
        }
    };

    // 
    $scope.open_file = function(){
        angular.element('#input_file').click();
    };

    // 
    $scope.download_xml = function(){
        if($scope.file_name){
            var output=$scope.xml_string_for_download;
            var blob=new Blob([output],{type:'application/x-file-to-save'});            // 讓瀏覽器辨識為可下載的連結, 也可以用 "octet/stream"
            var url=window.URL.createObjectURL(blob);           // 要使用 Blob URL, 需要有 Domain Name
            var file_name = $scope.file_name;
            
            // 不需要把這個元素加入 document
            var downloadURL=document.createElement('a');
            downloadURL.href=url;
            downloadURL.download=file_name;         // 指定下載檔名
            downloadURL.click();
        }
        else{
            alert('Please Open a XML File.')
        };
    };

    // 
    $scope.init = function(){
        $scope.input_file = null;
        $scope.file_name = null;
        $scope.xml = null;
        $scope.xml_string_tag_store = [];
        $scope.xml_string_for_download = '';
    };

    // 
    $scope.init();

    // 
    $scope.$watch('input_file', function(new_value, old_value){
        // 
        if(new_value && new_value.name){
            $scope.file_name = new_value.name;
        };

        // 
        if(new_value){
            $scope.init();
            $scope.file_name = new_value.name;
            reader.readAsText(new_value);
        }
    }, true);

    $scope.$watch('xml_string_tag_store', function(new_value, old_value){
        if(new_value && new_value.length > 0){
            for(var i in new_value){
                if(new_value[i] != old_value[i]){
                    $scope.xml.querySelector('[name=' + new_value[i].name + ']').textContent = new_value[i].value.replace(/\n/g, '\\n');
                }
            };

            var xml_parser = new XMLSerializer();
            $scope.xml_string_for_download = xml_parser.serializeToString($scope.xml);
        };
    }, true);
  });
