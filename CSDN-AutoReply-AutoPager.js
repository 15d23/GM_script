// ==UserScript==
// @name        AC-CSDN�Զ�չ��-CSDN�Զ�����-ȥ���
// @author      AC ԭ��:King.Sollyu
// @namespace   Sollyu
// @description �Զ�չ��CSDN���͵����ݣ�������չ��  &&  �Զ�����,�������ػ���
// @version     3.8
// @require     https://code.jquery.com/jquery-1.9.0.min.js
// @include     https://download.csdn.net/*
// @include     /https?://blog.csdn.net/[^/]+/article/details/.*/
// @include     /https?://lib.csdn.net/article/.*/
// @note        2018-08-28 V3.8    �������ֹ�������
// @note        2018-05-17 V3.7    �ٴ��޸�csdn���µ��µ�����
// @note        2018-04-30 V3.6    �޸�csdn��ҳ���µ��µļ���ʧ������
// @note        2018-04-06 V3.5    ����֧��lib.csdn.net
// @note        2018-03-29 V3.4    ��ҹ�޸��޷����۵�bug��http-->https������
// @note        2018-03-25 V3.3    �޸�����
// @note        2018-03-24 V3.2    ͬ��-�޸�https�µ���������
// @note        2017-12-06 V3.1    ��CSDN�Զ�չ��һ��ϲ�
// @note        2017-09-14 V3.0    �޸�ģʽ�������°��CSDN
// @note        2015-05-20 V2.1    �޸ĵ���λ�ã��޸Ľű���Чλ�ã��ṩ������ת
// @note        2015-05-20 V2.1    ��Chrome�п���
// @note        2013-01-25 V1.0    CSDN�Զ�����
// @icon        https://gitee.com/remixAC/GM_script/raw/master/images/head.jpg
// @run-at      document-body
// ==/UserScript==
/*
��Ҫ����ת��http://download.csdn.net/my/downloads
*/
function addStyle(css) { //���CSS�Ĵ���--copy��
    var pi = document.createProcessingInstruction(
        'xml-stylesheet',
        'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
    );
    return document.insertBefore(pi, document.documentElement);
}
if(location.host == "download.csdn.net"){
    setTimeout(function(){
        //����ʱ������һ�Σ���λ����
        var tTime=65;
        // Ԥ�������������,�ɰ��ո�ʽ�������,ע�����һ�к���û�ж���
        var contentPL=new Array(
            "��ȫ��,�ܺ���,лл����.",
            "ͦ��������ϣ�лл����.",
            "��ȫ,ʲô������,��л.",
            "������鼮���ܵ���ϸ,��һ��.",
            "����,�ʺ��ڳ������ŵ�ѧϰ.",
            "�ܺõ�����,����ȫ,лл.",
            "������,���Ǹо��е���.",
            "���xLZ�ռ�,������ͦ����.",
            "�о�����,ֻ�Ǹо����Ų����ر�˳��.",
            "����ѧϰ��ֵ���ĵ�,��л.",
            "���ݺܷḻ,��ɹ������Դ����Ҫ�ܶ����.",
            "�����ķǳ���,�����������.",
            "�в������ӿ��Բο�,Ŀǰ����Ҫ.",
            "���غ�������ʹ��.",
            "���Ӽ�ʵ��,���вο���ֵ."
        );

        var queueList = {};

        // css
        var  csdnHelperCss=document.createElement('style');
        csdnHelperCss.type='text/css';
        $(csdnHelperCss).html('.popWindow{position:fixed;z-index:10000;top:100px;right:650px;}.popWindow>span{display:block;text-align:left;color:cyan;text-shadow:0 0 2px white;background-color:#555;box-shadow:-1px -1px 4px gray;margin:5px 0 0 0;padding:00 6px 0 6px;cursor:pointer;font-size: 13px;}');

        $('body').prepend(csdnHelperCss);
        $('body').prepend('<div class="popWindow"></div>');

        //����ҳ��������Դ�Զ��������۶���
        $("li .flag a:not([href^='javascript'])").each(function(){
            if(this.tagName!="A")
                return;
            var reg=/\/([_a-zA-Z0-9]+)\/([0-9]+)#/;
            var src=$(this).attr('href').match(reg);
            addQueue(src[1],src[2],(new Date()).getTime());
            $(this).parent().html("�Ѽ������۶���");
        });
        // ��������������0����ʾ�û������ڱ�����
        console.debug("������������--->"+getJsonLength(queueList));
        if(getJsonLength(queueList) > 0){
            popWindow("��������������"+getJsonLength(queueList),0);
            popWindow("�뱣���ڱ����棬�Ա��������",6000);
            setInterval(searchToPost, tTime*1000);
            searchToPost();
        }else{
            if(location.href=='https://download.csdn.net/my/downloads'){
                popWindow("��ϲ��,��ʱû����Ҫ���۵�������",0);
            }else{
                popWindow("�Զ��ظ�������ת��<BR><center><a href=https://download.csdn.net/my/downloads><b><font color=Green>�ҵ�����</font></b></a>�鿴</center>",0);
            }
        }

        function getJsonLength(jsonData){
            var jsonLength = 0;
            for(var item in jsonData){
                jsonLength++;
            }
            return jsonLength;
        }

        // ������۶���
        function addQueue(owner,sourceID,stamp){
            queueList[stamp] = {owner, sourceID};
            console.log(stamp, queueList[stamp]);
            popWindow('����ӵ��������,['+owner+','+sourceID+']',2000);
        }
        // ��ʾ��Ϣ
        function popWindow(str,delayTime){
            var obj = $('.popWindow').append('<span>'+str+'</span>').children().last();
            if(delayTime>0)
                obj.delay(delayTime).hide(1500,function(){$(this).remove();});
        }

        function searchToPost(){
            // ��ѯ��û�п������۵���Դ
            for (var stamp in queueList){
                var res = queueList[stamp];
                post(res['owner'], res['sourceID'], stamp);
                break;
            }
        }
        // ��������
        function post(owner, sourceID, stamp){
            $.ajax({
                type:"get",
                url:"https://download.csdn.net/index.php/comment/post_comment",
                headers:{
                    "Referer":"https://download.csdn.net/download/"+owner+"/"+sourceID,
                    "Content-type":"application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With":"XMLHttpRequest"
                },
                data:{
                    "content":contentPL[Math.round(Math.random()*(contentPL.length-1))],
                    "jsonpcallback":"jQuery1111028717768093608154_"+(new Date()).getTime(),
                    "rating":"5",
                    "sourceid":sourceID,
                    "t":(new Date()).getTime()
                },
                success:function(res){
                    var index = res.indexOf("({");
                    var data = eval(res.substr(index));
                    var resMsg="----";
                    console.log(data.succ);
                    if(data.succ>0){
                        delete queueList[stamp];
                        resMsg = '����ɹ�! ������['+owner+','+sourceID+']<br/>-----ʣ��������:' + getJsonLength(queueList);
                        console.debug(resMsg);
                        popWindow(resMsg,(tTime+20)*1000);
                        $('.popWindow').children().each(
                            function(){
                                if(this.innerHTML.indexOf("������������")>=0)
                                    this.innerHTML=("��������������"+getJsonLength(queueList));
                            });
                    }
                    else{
                        resMsg = '��������ʧ��['+owner+','+sourceID+']'+"<br/>----ԭ��:"+data.msg;
                        console.debug(resMsg.replace(/<br\/>/,""));
                        popWindow(resMsg,60000);
                        if(data.msg.indexOf("���Ѿ����������")>=0){
                            delete queueList[stamp];
                        }
                    }
                }
            });
        }
    }, 1000);
}else if(location.host == "blog.csdn.net" || location.host == "lib.csdn.net"){
    // 1. �Զ�չ����������������
    var acCSDNT = setInterval(function(){
        if(document.querySelector("div") != null){
            clearInterval(acCSDNT);
            // ����lib.csdn.net
            addStyle(".divtexts{height:auto !important;max-height:unset !important;}");
            addStyle(".divcodes,.divmark{display:none !important;}");
            // ����blog.csdn.net
            addStyle(".article_content{height:auto !important;max-height:unset !important;}");
            addStyle(".hide-article-box{display:none !important;}");
        }
    }, 100);
    // 2. �Ƴ�����Ĺ������
    addStyle(".recommend-ad-box{display:none;}body>div[id*='kp_box_']{display:none;}");
}
