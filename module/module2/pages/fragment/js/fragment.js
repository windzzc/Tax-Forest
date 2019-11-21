// 自适应程序
var zidingyi_height;
$(document).ready(function(){
 var header=$(".content-header").offset().top+$(".content-header").height()
 var footer=$(".main-footer").offset().top
 zidingyi_height=footer-header;
 // console.log(zidingyi_height);
 $("#fragmentClassDiv").css("height",zidingyi_height*0.87+"px");
 $("#fragmentUnaddDiv").css("height",zidingyi_height*0.4+"px");
 $("#fragmentInfoDiv").css("height",zidingyi_height*0.4+"px");
})

var editor = new wangEditor('wang');
editor.config.uploadImgUrl = ip+'/SpiderAPI/createImageFragment';
editor.config.uploadImgFileName="imageContent";
editor.config.hideLinkImg = true;
editor.create();

var nowOperateClass;
var nowOperateTopic;
var nowOperateFacet1;
var nowOperateFacet2;
var nowOperateFacet3;
var nowOperateFacet1Id;
var nowOperateFacet2Id;
var nowOperateFacet3Id;

var modify_add_flag;
var now_modify_id;
var username=getCookie('userinfo').slice(getCookie('userinfo').indexOf(':')+2,getCookie('userinfo').indexOf(',')-1);

function choosetype(){
    $("#fragmentModal").modal();
    modify_add_flag=0;
}

setCookie("NowClass","税法","d900");
setCookie("NowTopic","关税","d900");

var app=angular.module('myApp',[
    'ui.bootstrap','ngDraggable'
    ]);
app.controller('myCon',function($scope,$http,$sce){
    $http.get(ip+'/domain/getDomains').success(function(response){

        $scope.getTopic(getCookie("NowClass"));
        $scope.gettopicfragment(getCookie("NowClass"),getCookie("NowTopic"));

        response = response["data"];
        $scope.subjects=response;
        // console.log(nowOperateClass);
        // $("#class_name").text(nowOperateClass);
        // if(getCookie("NowFacetLayer")==1){
        //     $scope.getfacet1fragment(getCookie("NowClass"),getCookie("NowTopic"),getCookie("NowFacet"));

        // }else if(getCookie("NowFacetLayer")==2){
        //     $scope.getfacet2fragment(getCookie("NowClass"),getCookie("NowTopic"),getCookie("NowFacet1"),getCookie("NowFacet"));

        // }else{
        //     $scope.getfacet3(getCookie("NowClass"),getCookie("NowTopic"),getCookie("NowFacet"));

        // }
    });

    $http.get(ip+'/assemble/getTemporaryAssemblesByUserName',{params:{"userName":username}}).success(function(response){
        response = response["data"];
        $scope.unaddfragments=response;
        $scope.getTopic(getCookie("NowClass"));
        for(var i=0;i<$scope.unaddfragments.length;i++){
            $scope.unaddfragments[i].assembleContent=$sce.trustAsHtml($scope.unaddfragments[i].assembleContent);
        }
    });

    $scope.isCollapsed = true;
    $scope.isCollapsedchildren = true;
    $scope.isCollapsedchildren2=true;

    $scope.getUnaddFragment=function(){
      $http.get(ip+'/assemble/getTemporaryAssemblesByUserName',{params:{"userName":username}}).success(function(response){
        response = response["data"];
        $scope.unaddfragments=response;
        for(var i=0;i<$scope.unaddfragments.length;i++){
            $scope.unaddfragments[i].assembleContent=$sce.trustAsHtml($scope.unaddfragments[i].assembleContent);
        }
    });  
    }


    $scope.dropFacetFragment=function(data,evt){
        var str=$("#fragmenttopic").text();
        var arr=str.split(" ");
        if((arr.length!=3)||(arr[1]=="")||(arr[0]=="主题")){
            alert("添加无效");
        }
        else if(arr[0]=="一级分面"){
            // console.log("1"+arr[1]);

            $http({
                method:'POST',
                url:ip+"/assemble/insertAssemble",
                params:{domainName:nowOperateClass
                    ,topicName:nowOperateTopic
                    ,facetName:arr[1]
                    ,facetLayer:1
                    ,temporaryAssembleId:data.assembleId}
            }).then(function successCallback(response){
                response = response["data"];
                alert("添加碎片成功");
                $scope.getfacet1fragment(nowOperateClass,nowOperateTopic,arr[1],nowOperateFacet1Id);
                $scope.getUnaddFragment();
            }, function errorCallback(response){

            });

        }
        else if(arr[0]=="二级分面"){
            // console.log("2"+arr[1]);

            $http({
                method:'POST',
                url:ip+"/assemble/insertAssemble",
                params:{domainName:nowOperateClass
                    ,topicName:nowOperateTopic
                    ,facetName:arr[1]
                    ,facetLayer:2
                    ,temporaryAssembleId:data.assembleId}
            }).then(function successCallback(response){
                response = response["data"];
                alert("添加碎片成功");
                $scope.getfacet2fragment(nowOperateClass,nowOperateTopic,arr[1],nowOperateFacet2Id);
                $scope.getUnaddFragment();
            }, function errorCallback(response){

            });
        }
        else if(arr[0]=="三级分面"){
            // console.log("3"+arr[1]);

            $http({
                method:'POST',
                url:ip+"/assemble/insertAssemble",
                params:{domainName:nowOperateClass
                    ,topicName:nowOperateTopic
                    ,facetName:arr[1]
                    ,facetLayer:3
                    ,temporaryAssembleId:data.assembleId}
            }).then(function successCallback(response){
                response = response["data"];
                alert("添加碎片成功");
                $scope.getfacet3(nowOperateClass,nowOperateTopic,arr[1],nowOperateFacet3Id);
                $scope.getUnaddFragment();
            }, function errorCallback(response){

            });
        }
        else{
            alert("添加无效");
        }
    }
    $scope.dragFragment=function(data,evt){
        // console.log("success");
    }


    $scope.addFrag=function(){
        
        
        var html = editor.$txt.html() + "";
        if(modify_add_flag==0){
            console.log("addFragment");
            $http({
                method:'POST',
                url:ip+"/assemble/insertTemporaryAssemble",
                data : $.param({assembleContent : html, userName:username}),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function successCallback(response){
                response = response["data"];
                alert("添加碎片成功");
                $scope.getUnaddFragment();
            }, function errorCallback(response){
            // console.log(html);
            alert("添加碎片失败");
        });
        }
        else if(modify_add_flag==1){
            console.log("modifyFragment_"+now_modify_id);
            $http({
                method:'POST',
                url:ip+"/assemble/updateTemporaryAssemble",
                data : $.param({assembleId:now_modify_id,
                                 assembleContent : html
                             }),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function successCallback(response){
                response = response["data"];
                alert("更新碎片成功");
                $scope.getUnaddFragment();
            }, function errorCallback(response){
            console.log(response);
            alert("更新碎片失败");
        });
        }

        else if(modify_add_flag==2){
            console.log("modifyAssemble_"+now_modify_id);
            $http({
                method:'POST',
                url:ip+"/assemble/updateAssemble",
                data : $.param({assembleId:now_modify_id,
                                 assembleContent : html
                             }),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function successCallback(response){
                alert("更新碎片成功");
                var type=document.getElementById("fragmenttopic").innerText.split(" ")[0];
                console.log(type);
                if(type=="主题"){
                    $scope.gettopicfragment(nowOperateClass,nowOperateTopic);
                }
                else if(type=="一级分面"){
                    $scope.getfacet1fragment(nowOperateClass,nowOperateTopic,nowOperateFacet1,nowOperateFacet1Id);
                }
                else if(type=="二级分面"){
                    $scope.getfacet2fragment(nowOperateClass,nowOperateTopic,nowOperateFacet2,nowOperateFacet2Id);
                }
                else if(type=="三级分面"){
                    $scope.getfacet3(nowOperateClass,nowOperateTopic,nowOperateFacet3,nowOperateFacet3Id);
                }
                // modify_add_flag=0;
            }, function errorCallback(response){
            console.log(response);
            alert("更新碎片失败");
            // modify_add_flag=0;
        });
        }

        
    }

    
    //杨宽添加,显示分面树函数
    $scope.showFacetTreeWithLeaves=function(className,subjectName){
        $.ajax({

            type: "POST",
            url: ip+"/topic/getCompleteTopicByNameAndDomainNameWithHasFragment",
            data: $.param( {
                domainName:className,
                topicName:subjectName,
                hasFragment:false
            }),
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            
            success: function(response){
                dataset = response["data"];
                displayTree(dataset);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                //通常情况下textStatus和errorThrown只有其中一个包含信息
                alert(textStatus);
            }
        });
    }

    $scope.getInfo=function(){
        nowOperateClass=document.getElementById("nameofclass").value;
        $("#class_name").text(nowOperateClass);

        $http({
            method:'GET',
            url:ip+"/domain/getDomainTreeByDomainName",
            params:{domainName:nowOperateClass}
        }).then(function successCallback(response){
            response = response["data"];
            console.log(response.data);
            $scope.classInfo=response.data;
        }, function errorCallback(response){

        });
    }


    $scope.getTopic=function(a){
        nowOperateClass=a;

        $http({
            method:'GET',
            url:ip+"/domain/getDomainTreeByDomainName",
            params:{domainName:nowOperateClass}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.classInfo=response.data;
        }, function errorCallback(response){

        });
    }


    $scope.gettopicfragment=function(a,b){
        nowOperateClass=a;
        nowOperateTopic=b;

        $http({
            method:'GET',
            url:ip+"/assemble/getAssemblesInTopic",
            params:{domainName:a,topicName:b}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].assembleContent=$sce.trustAsHtml($scope.fragments[i].assembleContent);
           }
           $("#fragmenttopic").text("主题 "+b+" 下碎片");
           $("#topictree").text("主题 "+b+" 主题树");
        }, function errorCallback(response){

        });
    }


    $scope.getfacet1fragment=function(a,b,c,d){
        nowOperateClass=a;
        nowOperateTopic=b;
        nowOperateFacet1=c;
        nowOperateFacet1Id=d;

        $http({
            method:'GET',
            url:ip+"/assemble/getAssemblesByFacetId",
            params:{facetId:d}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].assembleContent=$sce.trustAsHtml($scope.fragments[i].assembleContent);
           }
           $("#fragmenttopic").text("一级分面 "+c+" 下碎片");
           $("#topictree").text("主题 "+b+" 主题树");
        }, function errorCallback(response){

        });
    }

    
    $scope.getfacet2fragment=function(a,b,c,d){
        nowOperateClass=a;
        nowOperateTopic=b;
        nowOperateFacet2=c;
        nowOperateFacet2Id=d;

        $http({
            method:'GET',
            url:ip+"/assemble/getAssemblesByFacetId",
            params:{facetId:d}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].assembleContent=$sce.trustAsHtml($scope.fragments[i].assembleContent);
           }
           $("#fragmenttopic").text("二级分面 "+c+" 下碎片");
           $("#topictree").text("主题 "+b+" 主题树");
        }, function errorCallback(response){

        });
    }

    $scope.getfacet3=function(a,b,c,d){
        nowOperateClass=a;
        nowOperateTopic=b;
        nowOperateFacet3=c;
        nowOperateFacet3Id=d;

        $http({
            method:'GET',
            url:ip+"/assemble/getAssemblesByFacetId",
            params:{facetId:d}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].assembleContent=$sce.trustAsHtml($scope.fragments[i].assembleContent);
           }
           $("#fragmenttopic").text("三级分面 "+c+" 下碎片");
           $("#topictree").text("主题 "+b+" 主题树");
        }, function errorCallback(response){

        });
    }

    $scope.modifyFragment=function(a){
        modify_add_flag=1;
        now_modify_id=a;
        $("#fragmentModal").modal();

        $http({
            method:'GET',
            url:ip+"/assemble/getTemporaryAssembleById",
            params:{assembleId:a}
        }).then(function successCallback(response){
            response = response["data"];
            // console.log(response.data[0].FragmentContent);
            $("#wang").html(response.data.assembleContent);
        }, function errorCallback(response){

        });
    }

    $scope.modifyAssemble=function(a){
        modify_add_flag=2;
        now_modify_id=a;
        $("#fragmentModal").modal();

        $http({
            method:'GET',
            url:ip+"/assemble/getAssembleById",
            params:{assembleId:a}
        }).then(function successCallback(response){
            console.log(response.data.data.assembleContent);
            $("#wang").html(response.data.data.assembleContent);
        }, function errorCallback(response){

        });
    }

    $scope.deleteUnaddFragment=function(a){
        // console.log(a);

        $http({
            method:'GET',
            url:ip+"/assemble/deleteTemporaryAssemble",
            params:{assembleId:a}
        }).then(function successCallback(response){
            response = response["data"];
            alert(response.data);
        }, function errorCallback(response){

        });
    }

    $scope.deleteFragment=function(a){

        $http({
            method:'GET',
            url:ip+"/assemble/deleteAssemble",
            params:{assembleId:a}
        }).then(function successCallback(response){
            response = response["data"];
            alert(response.data);
        }, function errorCallback(response){

        });
    }
    // 每个碎片的内容
    $scope.getFragmentDetail=function(obj){
        console.log(obj);
        $('#fragmentDetail').modal('show');
        document.getElementById("fragmentDetailContent").innerHTML=obj.assembleContent;
    }
});