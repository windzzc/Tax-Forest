$(document).ready(function(){
    var topic;
    $.ajax({
        type :"GET",
        url :ip+"/topic/getTopicsByDomainName?domainName="+getCookie("NowClass"),
        datatype :"json",
        async:false,
        success : function(response,status){
            topic = response["data"];
             console.log("topic个数："+topic.length);
        },
         error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log(XMLHttpRequest);                           
                if(XMLHttpRequest['responseJSON']['code']==134){
                layer.alert(XMLHttpRequest['responseJSON']['msg']);  
                }
                else if(XMLHttpRequest['responseJSON']['code']==122){
                layer.alert(XMLHttpRequest['responseJSON']['msg']);  
                }   
                 
            }

    });
//console.log(topic);





  


    var ykapp = angular.module('classApp', []);
    ykapp.controller('classController', function($scope, $http) {        
        console.log('当前学科为：' + getCookie("NowSubject") + '，课程为：' + getCookie("NowClass"));
        $scope.NowSubject = getCookie("NowSubject");
        $scope.NowClass = getCookie("NowClass");
    });

})


