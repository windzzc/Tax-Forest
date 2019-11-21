// 自适应程序
var zidingyi_height
$(document).ready(function(){
    var header=$(".content-header").offset().top+$(".content-header").height();
    var footer=$(".main-footer").offset().top;
    zidingyi_height=footer-header;
    $("#div1").css("height",zidingyi_height*0.9+"px");
    $("#div2").css("height",zidingyi_height*0.9+"px");
    $("#div3").css("height",zidingyi_height*0.7+"px");
    $("#RightfacetTree").css("height",zidingyi_height*0.78+"px");
    // console.log(zidingyi_height);
    // console.log($("#div1").css("height"));

})


var app=angular.module('facetTreeApp',[]);
app.controller("facetTreeController",function($scope,$http){

        if(getCookie("NowClass") == false){
            layer.alert("分面查询失败，没有指定课程");
        }
    console.log('当前学科为：' + getCookie("NowSubject") + '，课程为：' + getCookie("NowClass"));
    $scope.NowSubject = getCookie("NowSubject");
    $scope.NowClass = getCookie("NowClass");
    $http.get(ip+'/topic/getTopicsByDomainName?domainName='+getCookie("NowClass")).success(function(data){
        response = data["data"]

        $scope.topics=response;
        // 默认加载显示
        $scope.fenmianshow(response[0].topicName);
        $scope.Branch();
    });
    $scope.subjectName="字符串";
    $scope.treeFlag="trunk";
    $scope.fenmianshow=function(subjectName){
        // console.log(subjectName);
        $scope.subjectName=subjectName;
        $('.edit').val(subjectName);
        
      //  console.log(subjectName);
        $.ajax({
            type:"GET",
            url:ip+"/facet/getSecondLayerFacetGroupByFirstLayerFacet?domainName="+getCookie("NowClass")+"&topicName="+subjectName,
            data:{},
            dataType:"json",
            async:false,
            success:function(data){
                $scope.facets=data["data"];
                // console.log( $scope.facets);
            }
        });

    }
    $scope.setBranch=function(){
         $scope.treeFlag="branch";
         $("#all-build-state").html("全部生成成功！");
    }
    $scope.BuildTrunkorBranch=function(){
        if($scope.treeFlag==="trunk"){
            ObtainTrunk($scope.subjectName);
        }
        else{
            $.ajax({
                type: "POST",
                url: ip+"/topic/getCompleteTopicByNameAndDomainNameWithHasFragment",
                data: $.param( {
                    domainName:getCookie("NowClass"),
                    topicName:$scope.subjectName,
                    hasFragment:false
                }),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                // type: "GET",
                //     url: ip+"/AssembleAPI/getTreeByTopicForFragment",
                //     data: {
                //     ClassName:getCookie("NowClass"),
                //     TermName:$scope.subjectName
                // },
                // dataType: "json",
                success: function(response){
                    data = response['data'];
                    DisplayBranch(data);
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(textStatus);
                }
            });
        }
    }
    $scope.Branch=function(){
        $.ajax({
            type: "POST",
            url: ip+"/topic/getCompleteTopicByNameAndDomainNameWithHasFragment",
            data: $.param( {
                domainName:getCookie("NowClass"),
                topicName:$scope.subjectName,
                hasFragment:false
            }),
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            // type: "GET",
            //     url: ip+"/AssembleAPI/getTreeByTopicForFragment",
            //     data: {
            //     ClassName:getCookie("NowClass"),
            //     TermName:$scope.subjectName
            // },
            // dataType: "json",
            success: function(response){
                data = response['data'];
                DisplayBranch(data);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                //通常情况下textStatus和errorThrown只有其中一个包含信息
                console.log(textStatus+"00");
            }
        });
    }
});

function important(div){
    $(".top").css("background","white");
    $(".top").css("color","#5FB878");
     $(".top").css("transation","all 0.5s ease");
    // console.log(div);
    div.style.background="#d9edf7";
    div.style.color="red";

    // $(".top").css("background","white");
    // $(".top").css("color","black");
    // div.style.background="#428bca";
    // div.style.color="white";
    //console.log(div);
    var fenmian=document.getElementsByClassName("fenmian");



    for(var i=0;i<fenmian.length;i++){
        var div=fenmian[i].getElementsByTagName("div");

        if(div.length==0){
            fenmian[i].style.display="none";
        }
    }
;
   
}


function add(){

 var b=getCookie("NowSubject");
 var c=getCookie("NowClass");
console.log(b+"**********"+c);


 layui.use('layer', function(){
    var layer = layui.layer;
    var remember = '';
    
 var tag = localStorage.getItem("tag");
      layer.prompt({
        formType: 2,
        anim: 1,
        offset: ['100px', 'calc(70% - 500px)'],
        value: tag,
        title: '增加主题',
        skin: 'demo-class',
        area: ['280px', '150px'],
        id: 'remember' ,//设定一个id，防止重复弹出
        btn: ['确认增加', '取消增加'],
        shade: 0,
        moveType: 1, //拖拽模式，0或者1
        btn2: function(index, layero){
            localStorage.removeItem("tag"); 
            $('#remember textarea').val(''); 
            console.log("取消按钮");
            return false;

          }
      },function(value, index, elem){
        console.log(b)
        console.log(c);
        console.log(value);
        $.ajax({
            type: "GET",
            url: ip+"/topic/insertTopicByNameAndDomainName",
            data: $.param( {
                domainName:getCookie("NowClass"),
                topicName:value                
            }),
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            // type: "GET",
            //     url: ip+"/AssembleAPI/getTreeByTopicForFragment",
            //     data: {
            //     ClassName:getCookie("NowClass"),
            //     TermName:$scope.subjectName
            // },
            // dataType: "json",
            success: function(response){

                if(response['code'] == 200){
                    layer.alert(response['data']);
                }
                setTimeout(function(){ location=location; }, 3000);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                //通常情况下textStatus和errorThrown只有其中一个包含信息          
                if(XMLHttpRequest['responseJSON']['code']==126){
                    layer.alert(XMLHttpRequest['responseJSON']['msg']);
                }
                  setTimeout(function(){ location=location; }, 3000);
            }
        });







       
      })
   
  }); 

}


function edit(edit){
        var b=getCookie("NowSubject");
        var c=getCookie("NowClass");
        console.log(edit);
        var a=edit.childNodes[1].innerHTML;
        console.log(edit.childNodes[1].innerHTML)
 layui.use('layer', function(){
    var layer = layui.layer;
    var remember = '';
    
 var tag = localStorage.getItem("tag");
      layer.prompt({
        formType: 2,
        anim: 1,
        offset: ['100px', 'calc(70% - 500px)'],
        value: a,
        title: '修改主题',
        skin: 'demo-class',
        area: ['280px', '150px'],
        id: 'remember' ,//设定一个id，防止重复弹出
        btn: ['确认修改好了', '取消修改'],
        shade: 0,
        moveType: 1, //拖拽模式，0或者1
        btn2: function(index, layero){
            localStorage.removeItem("tag"); 
            $('#remember textarea').val('132'); 
            alert(0);
            return false;
          }
      },function(value, index, elem){

         $.ajax({
            type: "GET",
            url: ip+"/topic/updateTopicByTopicName",
            data: $.param( {
                domainName:getCookie("NowClass"),
                oldTopicName:a,
                newTopicName:value,
                topicName:a                
            }),
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},        
            success: function(response){
                console.log(response);

                if(response['code'] == 200){
                    layer.alert(response['data']);
                }
               setTimeout(function(){ location=location; }, 3000);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){               
                console.log(XMLHttpRequest);         
                if(XMLHttpRequest['responseJSON']['code']==126){
                    layer.alert(XMLHttpRequest['responseJSON']['msg']);
                }
                setTimeout(function(){ location=location; }, 3000);
            }
        })




        
      })
   
  }); 

}

function dele(dele){
        var b=getCookie("NowSubject");
        var c=getCookie("NowClass");
        console.log(c);
        var a=dele.childNodes[1].innerHTML;
        console.log(dele.childNodes[1].innerHTML)
      layer.confirm('确定要删除该主题', function(index) {
                $.ajax({
            type: "GET",
            url: ip+"/topic/deleteTopicByNameAndDomainName",
            data: $.param( {
                domainName:getCookie("NowClass"),
                topicName:a                
            }),
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},        
            success: function(response){
                console.log(response);

                if(response['code'] == 200){
                    layer.alert(response['data']);
                }
               setTimeout(function(){ location=location; }, 3000);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){               
                console.log(XMLHttpRequest);         
                if(XMLHttpRequest['responseJSON']['code']==126){
                    layer.alert(XMLHttpRequest['responseJSON']['msg']);
                }
                setTimeout(function(){ location=location; }, 3000);
            }
        });



      })



}





