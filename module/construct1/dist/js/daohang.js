text_1='知识主题抽取算法利用主题名语法规则与拓扑特性从维基百科、百度百科等高质量数据源中抽取出具有多分面特性的领域术语作为知识主题。在这里我们基于课题1中碎片化文本的实体表示与语义相似度计算方法，实现了备选知识主题的识别与消歧，利用课题5中面向知识导航的概念抽取和语义理解方法筛选出用于构建教育知识图谱节点的知识主题。'
text_0='为了缓解碎片化知识SOD三特性引发的问题，我们课题组提出了一种知识聚合新模式——“知识森林”，将多源、片面、无序的碎片化知识聚合成符合人类认知学习特点的森林结构。知识森林概念层次为“知识主题——主题分面树——知识森林”。'
text_2='基于课题2中复杂海量领域知识的语义集成技术实现知识主题树的构建，对每个主题，抽取它的分面集合以及分面之间的层级关系构成树状结构称为分面树。'
text_3='挖掘出知识主题间的因果、参考、对比等认知关系，为用户规划一条由认知关系组成的认知路径，实现导航学习。'
text_4='根据主题从多个数据源，比如中文维基, 百度知道、LOD中采集知识碎片，通过应用课题2中碎片化数据的噪音清洗技术和课题3中基于信念传播的关联数据冲突消解方法对知识碎片去冗、去噪、冲突消解以及置信度评估实现量质转换，得到高质量的知识碎片数据集。'
text_5='知识碎片装配算法将知识碎片装配问题转化为文本匹配问题，利用课题1的在线特征降维方法对多源海量数据碎片化知识进行建模，利用课题3的多模态碎片化知识分面融合方法，关联主题分面与文本知识碎片及图像知识碎片，实现碎片化知识的装配。'
text_6='知识森林是“分面聚合+主题导航”的新型知识聚合模式。由实例化的主题分面树通过主题间认知关系联结而成，如同显示森林中树之间的路径。'
text=[text_0,text_1,text_2,text_3,text_4,text_5,text_6]


var app = angular.module('myApp', [ ]);

app.controller('menu', function($scope, $http) {
 
    var img=$("#ImgNavigation")
    var step=getCookie("stepNumber")
    if (step=='') {
        step=1;
        setCookie("stepNumber",1,"d900")
    }
    img.attr('width', "");
    img.attr('src', 'dist/img/daohang.jpg');
    img.load(function(){
        // img.addClass('img-responsive')
        setImgArea()
        display(0)
    })

    // 获取学科和课程数据
    $http.get(ip+"/domain/getDomainsGroupBySubject").success(
        function(response) { 
            //响应response相对，增加状态信息和编码
            data = response["data"];
            $scope.subjects = response["data"];

            var classSum = 0;
            // 切回导航页面时，读取现有课程并更新两个框的值
            for(i = 0; i < data.length; i++) {
                classSum = classSum + data[i].domains.length;
                if(data[i].subjectName == getCookie("NowSubject")) {
                    $scope.subject = data[i];
                    for(j = 0; j < data[i].domains.length; j++) {
                        if(data[i].domains[j].domainName == getCookie("NowClass")) {
                            $scope.domain = data[i].domains[j];
                        }
                    }
                }
            }
            $scope.subjectNum = data.length;
            $scope.classSum = classSum;
        }
    );

    $scope.change = function(){  
        //获取被选中的值  
        var chengeitem = $scope.domain.domainName;
        setCookie("NowClass", $scope.domain.domainName, "d900");
        setCookie("NowSubject", $scope.subject.subjectName, "d900");
        //js代码实现option值变化后的查询等操作      
    } 

})
function resetCookie(){
    setCookie("stepNumber",1,"s900")
    display(0)
    // console.log(getCookie("stepNumber"))
     // window.location.reload();
}


 // <!-- 设置图片 点击事件  跳转到不同的地方 -->
 function pageto(number){
    imagehide(number)
     if (number==0) {
        // setCookie("stepNumber",number+1,"d900")
        // setImgSrc()

        return 
    }
    else if (number==1) {
        // setCookie("stepNumber",number+1,"d900")
        // setImgSrc()

        window.location= "pages/extraction/index.html"
    }else if (number==2) {
        // setCookie("stepNumber",number+1,"d900")
        // setImgSrc()
       window.location= "pages/facet/index.html"
    }
    else if (number==3) {
        // setCookie("stepNumber",number+1,"d900")
        // setImgSrc()
        window.location= "pages/relationship/index.html"
    }
    else if (number==4) {
        // setCookie("stepNumber",number+1,"d900")
        // setImgSrc()
        window.location= "pages/spider/index.html"
    }else if (number==5) {
        // setCookie("stepNumber",number+1,"d900")
        // setImgSrc()
        window.location= "pages/add/index.html"
    }
    else if (number==6) {
        // setCookie("stepNumber",number,"d900")
        // setImgSrc()
       window.location= "pages/kg/index.html"
    }
 }

function display(i){
    // var i=getCookie("stepNumber");
    setCookie("stepNumber",i,"d900")
    $("#text").html(text[i])
    if (i==0) {
        $('#image').attr('src',"")
        return
    }
    $('#image').attr('src',"dist/img/tishi/step"+i+".png")
}

function imagehide(i){
    if (i==0) {
         $('#imagehref').hide();
    } else {
        $('#imagehref').show();
    }
}



 // <!-- 设置图片热区 -->
function setImgArea(){
    var img=$("#ImgNavigation")

    var area1=$('#area1')
    area1.attr("coords",""+397/1948*img.width()+","+409/520*img.height()+","+98/1948*img.width())
    var area2=$('#area2')
    area2.attr("coords",""+831/1948*img.width()+","+405/520*img.height()+","+98/1948*img.width())
    var area3=$('#area3')
    area3.attr("coords",""+1257/1948*img.width()+","+401/520*img.height()+","+98/1948*img.width())
    var area4=$('#area4')
    area4.attr("coords",""+839/1948*img.width()+","+105/520*img.height()+","+98/1948*img.width())
    var area5=$('#area5')
    area5.attr("coords",""+1257/1948*img.width()+","+101/520*img.height()+","+98/1948*img.width())
    var area6=$('#area6')
    area6.attr("coords",""+1743/1948*img.width()+","+295/520*img.height()+","+98/1948*img.width())
};

$(document).ready(function(){
  
});
