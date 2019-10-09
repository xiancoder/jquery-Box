    /*================================================================================*\
    *  |说明|_格式化 美化代码
    *  |说明|
    *  |返回|值
    \*================================================================================*/
    //正常格式化各种代码
    function _bs(el){
        var c = el.innerHTML,
            sp = c.match(/^[ ]*[\n|\r|\r\n]([ ]*)/),
            uiBs = sp && sp[1] && Math.floor( sp[1].length / 4 ) || 5;
        var tagName = $(el)[0].tagName.toLowerCase();
        if(tagName=="style") $(el).before("<h6><kbd><i class='glyphicon glyphicon-th'></i> 样式表 </kbd></h6>");
        else if(tagName=="script") $(el).before("<h6><kbd><i class='glyphicon glyphicon-th'></i> 代码 </kbd></h6>");
        var r = _RegExp_create( "\n" + _String_repeat( " " , 4*( parseInt(uiBs) ) ) );
        var pre = document.createElement("pre");
        pre.className="prettyprint linenums";
        _Dom_insertBefore(pre,el);
        pre.appendChild(el.cloneNode(true));
        var r = ( c.replace( /\n|\r|\r\n/ , "" ).replace( /^[ ]*|[ ]*$/g , "" ).replace( r.g , "\n" ) );
        pre.innerHTML = prettyPrintOne(_String_escapeHTML(r),"",true);
    }
    //远程读取并格式化各种文件
    function _bs2(el,uiUrl){
        var pre = $("<pre class='prettyprint linenums'></pre>");
        var tagName = $(el)[0].tagName.toLowerCase();
        if(tagName=="style"){$(el).before("<h6><kbd><i class='glyphicon glyphicon-list-alt'></i> 样式表 "+uiUrl+"</kbd></h6>");}
        else if(tagName=="script"){$(el).before("<h6><kbd><i class='glyphicon glyphicon-list-alt'></i> 脚本 "+uiUrl+"</kbd></h6>");}
        $(el).before( pre );
        $.ajax({ url: uiUrl , dataType :"text", success: function(text){
            pre.html( prettyPrintOne(_String_escapeHTML(text),"",true) );
        }});
    }
    //远程读取并格式化代码文件并执行其中测试方法
    function _bs3(el,uiUrl){
        var pre = $("<pre class='prettyprint linenums'></pre>");
        var tagName = $(el)[0].tagName.toLowerCase();
        if(tagName=="style"){$(el).before("<h6><kbd><i class='glyphicon glyphicon-list-alt'></i> 样式表 "+uiUrl+"</kbd></h6>");}
        else if(tagName=="script"){$(el).before("<h6><kbd><i class='glyphicon glyphicon-list-alt'></i> 脚本 "+uiUrl+"</kbd></h6>");}
        $(el).before( pre );
        $.ajax({ url: uiUrl , dataType :"text", success: function(text){
            var dotest = function( code ){ try{ return window.eval( "("+code+")" ) }catch(e){ console.error(code,e); return "代码错误" } };
            text = text.replace(/\_bs\((.*)\,result\_flag\_here/g,function(a,b,c){ return "测试 "+b+" 结果 "+dotest( b ) })
            var code = _String_escapeHTML( text );
            pre.html( prettyPrintOne( code,"",true ) );
        }});
    }
    //正常格式化各种代码 + 新模板写法
    function _bsII(el,name){
        var c = el.innerHTML,
            sp = c.match(/^[ ]*[\n|\r|\r\n]([ ]*)/),
            uiBs = sp && sp[1] && Math.floor( sp[1].length / 4 ) -1 || 5;
        $(el).before("<h6><kbd><i class='glyphicon glyphicon-th'></i> "+name+" </kbd></h6>");
        var r = _RegExp_create( "\n" + _String_repeat( " " , 4*( parseInt(uiBs) ) ) );
        var pre = document.createElement("pre");
        pre.className="prettyprint prettyprinted linenums";
        _Dom_insertBefore(pre,el);
        pre.appendChild(el.cloneNode(true));
        var r = "    "+( c.replace( /\n|\r|\r\n/ , "" ).replace( /^[ ]*|[ ]*$/g , "" ).replace( r.g , "\n" ) );
        pre.innerHTML = prettyPrintOne(_String_escapeHTML(r),"",true);
    }
    function uibs( me ){
        me.find("[ui-bs]").each(function(i){ _bs( $(this)[0] ); });
        me.find("[ui-bs2-url],[ui-bs2-src]").each(function(i){ _bs2($(this)[0],$(this).attr('ui-bs2-url')); });
        me.find("[ui-bs3-url],[ui-bs3-src]").each(function(i){ _bs3($(this)[0],$(this).attr('ui-bs3-url')); });
        //
        me.find("[ui-bsii-js]").each(function(i){ _bsII( $(this)[0],"脚本展示" ); });
        me.find("[ui-bsii-css]").each(function(i){ _bsII( $(this)[0],"样式展示" ); });
        me.find("[ui-bsii-html],[ui-bsii]").each(function(i){ _bsII( $(this)[0],"模板展示" ); });
        //
        me.find("script").each(function(i){ var a=$(this).attr("src");if(a) $(this).after("<h6><kbd>&lt;script src=\" "+a+"\"&gt;&lt;/script&gt;</kbd></h6>") });
        me.find("link").each(function(i){ var a=$(this).attr("href");if(a) $(this).after("<h6><kbd>&lt;link rel=\"stylesheet\" href=\""+a+"\" /&gt;</kbd></h6>") });
    }
    function _RegExp_create(op) {
        var args = Array.prototype.slice.call(arguments, 0), op = op || "";
        var regText = args.join("") || "liuyp";
        return {
            g: new RegExp(regText, "g"),
            gi: new RegExp(regText, "gi"),
            i: new RegExp(regText, "i"),
            no: new RegExp(regText, "")
        };
    }
    function _Dom_insertBefore(newEl, targetEl) {
        var parentEl = targetEl.parentNode;
        parentEl.insertBefore(newEl,targetEl);
    }
    function _String_escapeHTML(str){
        if(null==str){return""}
        var ra = function(S,A,B){for(var i=0,l=A.length;i<l;i++){ var R=new RegExp(A[i],"g"); S=S.replace(R,"&"+B[i]+';') };return S};
        return ra(str,["&"," ",">","<","\""],['amp','nbsp','gt',"lt",'quot'])
    }
    function _String_repeat(str,num){
        if((null==str)){return ""||str}
        return new Array(num+1).join(str)
    }