_jsload2&&_jsload2('local', 'ab.jM=function(a,b){return!a||"undefined"==typeof b||"s"==a&&11!=b&&7!=b&&2!=b&&26!=b&&28!=b||"nb"==a&&12!=b||"bd"==a&&21!=b||"bda"==a&&45!=b||"sa"==a&&46!=b||"nba"==a&&47!=b?q:o}; x.extend(ab.prototype,{Dz:function(){for(var a=0,b=this.Pa.length;a<b;a++){var c=this.Pa[a];this[c.method].apply(this,c.arguments)}delete this.Pa;this.ra()},ra:function(){this.$m=new eh(this);this.Zm=new fh(this)},search:function(a,b,c){if(!a||a instanceof Array&&(1>a.length||10<a.length))this.Pe(),this.sb(5),this.Sa(W.Sc);else if(b=b||{},b.customData)this.Nz(),this.qs.search({tb:a,Mp:"local",Uw:b.customData}),this.Ql=o;else{this.Ql=q;var d=c||{},e=this;this.Ig(this.yd,function(c){c=c||1;e.Fc=e.FA(a); c=e.Fc?{qt:"sa",c:c,wd:a.join("$$"),wdn:a.length,rn:e.of()}:{qt:b.forceLocal?"con":"s",c:c,wd:a,rn:e.of()};e.k.Fp&&x.extend(c,{from:e.k.Fp});x.extend(c,d.Zc);b.log&&(c.log="center");var g={Zc:c,options:b,sd:d.sd||a};x.extend(g,d);cd.cb(function(a,b){e.Jf(a,b)},c,g)})}},FA:function(a){return a&&a instanceof Array?o:q},bn:function(a,b,c){if(!a||!b||a instanceof Array&&(1>a.length||10<a.length))this.Pe(),this.sb(5),this.Sa(W.Sc);else{var c=c||{},d=this;if(c.customData)this.Nz(),this.qs.search({tb:a, $a:b,Mp:"bound",Uw:c.customData}),this.Ql=o;else{this.Ql=q;var e=c||{};this.Ig(this.yd,function(c){var c=c||1,g=b.ve(),i=b.nf(),g=S.zb(g),i=S.zb(i),g="("+g.lng+","+g.lat+";"+i.lng+","+i.lat+")";d.Fc=d.FA(a);c=d.Fc?{qt:"bda",c:c,wd:a.join("$$"),wdn:a.length,ar:g,rn:d.of(),l:18}:{qt:"bd",c:c,wd:a,ar:g,rn:d.k.Gk,l:18};d.k.Fp&&x.extend(c,{from:d.k.Fp});x.extend(c,e.Zc);cd.cb(function(a,b){d.Jf(a,b)},c,e&&e.Ga&&e.xa?{Zc:c,$a:b,Ga:e.Ga,xa:e.xa,sd:e.sd||a}:{Zc:c,$a:b,sd:e.sd||a})})}}},Lp:function(a,b,c, d){if(!a||!b||!(b instanceof H)&&"object"==typeof b&&!b.uid||a instanceof Array&&(1>a.length||10<a.length))this.Pe(),this.sb(5),this.Sa(W.Sc);else if(d=d||{},d.customData)this.Nz(),this.qs.search({tb:a,Ga:b,xa:c,Mp:"nearby",Uw:d.customData}),this.Ql=o;else{this.Ql=q;var c=c||ab.lG,c=0>c?ab.lG:c>ab.sG?ab.sG:c,e=this,f=d||{};if(b instanceof H){var g=S.zb(b),d=new H(g.lng-c,g.lat-c),g=new H(g.lng+c,g.lat+c),d=S.Ab(d),g=S.Ab(g),d=new db(new H(d.lng,d.lat),new H(g.lng,g.lat));f.Ga=b;f.xa=c;this.bn(a,d, f)}else this.Ig(this.yd,function(d){d=d||1;e.Fc=e.FA(a);d=e.Fc?{qt:"nba",c:d,wd:a.join("$$"),wdn:a.length,rn:e.of(),uid:b.uid,r:c}:{qt:"nb",c:d,wd:a,rn:e.of(),uid:b.uid,r:c};if("string"==typeof b){if(e.Fc){d.qt="sa";for(var g=[],l=0;l<a.length;l++)g.push(b+" "+a[l]);d.wd=g.join("$$");d.wdn=g.length}else d.qt="s",d.wd=b+" "+a;delete d.r;delete d.uid}e.k.Fp&&x.extend(d,{from:e.k.Fp});x.extend(d,f.Zc);cd.cb(function(a,b){e.Jf(a,b)},d,{Zc:d,Ga:b,xa:c,sd:f.sd||a})})}},Jf:function(a,b){var c=this;c.Fc= 45==a.result.type||46==a.result.type||47==a.result.type?o:q;this.Pe();c.Fa=a;this.ga=b;var d=a.result,e=b.Zc.qt;if(c.Fc){if(0!=d.error||!ab.jM(e,d.type)){i=a.current_city;this.Ii=[];for(var d=b.sd,e=0,f=d.length;e<f;e++){var g=new gh({tb:d[e],city:i.name,province:i.up_province_name||"",Ew:i.code,Bp:c.of(),Ga:b.Ga,xa:b.xa,$a:b.Ga&&b.xa?j:b.$a,ri:""});g.kB=b.Zc.qt;this.Ii.push(g)}this.sb(2);this.Sa(W.Sc,this.Ii);c.Zm.dispatchEvent("render");return}}else if(0!=d.error||!ab.jM(e,d.type)){var i=a.current_city; this.ja=new gh({tb:b.sd,city:i.name,province:i.up_province_name||"",Ew:i.code,Bp:c.of(),Ga:b.Ga,xa:b.xa,$a:b.Ga&&b.xa?j:b.$a,ri:this.gv(b,i)});this.ja.kB=b.Zc.qt;this.sb(2);this.Sa(W.Sc,this.ja);c.Zm.dispatchEvent("render");return}c.Fl(b);c.$m.dispatchEvent("render");c.Zm.dispatchEvent("render");(d=this.ga.Ga)&&("string"!=typeof d&&!(d instanceof H))&&this.$m.ow(d);d={};switch(this.Fa.result&&this.Fa.result.type){case 11:case 12:case 21:case 45:case 46:case 47:d.ia=this.rz;break;case 2:d.Ga=this.ja.xk(0).point; d.tg=this.Fa.content.level;break;case 28:d.Ga=this.ja.xk(0).point;d.tg=13;break;case 26:d.Ga=this.ja.xk(0).point,d.tg=parseInt(this.Fa.content[1])}this.$m.kL(d);d=this.Fc?this.hA():this.ja;this.k.ka.Ot&&(d&&0<d.Xs())&&(c=this,setTimeout(function(){c.select(0)},240))},Fl:function(a){var b=this.Fa.result,c=this.Fa.content,d=this.Fa.current_city,e=b.type,f=b.page_num||0,g=0,i=0,k=[],l=[],m=[],n=[],t=[],v=[];if(this.Fa.psrs&&this.Fa.psrs.SEResult){var w=this.Fa.psrs.SEResult;if(0<w.length)for(var y=0, B=w.length;y<B;++y)v.push(w[y])}if(w=this.Fa.suggest_query){y=0;for(B=w.length;y<B;++y)w[y]&&w[y].query&&v.push(w[y].query)}v=O.unique(v);if(7!=e&&26!=e){var A;this.Fc||(i=b.count-(0==f?b.spec_dispnum||0:0),g=760>b.total?b.total:760,A=0==f?b.spec_dispnum||0:0);if(2!=e)if(this.Fc){B=b.result_array;f=a.sd.length;for(y=0;y<f;y++)if(n[y]=[],t[y]=[],m[y]=[],B[y])if(7==B[y].type){if(c&&c[y])for(A=0;A<c[y].length;A++)w=c[y][A],m[y].push({city:w.name,Kz:w.code,numResults:w.num});if(this.Fa.more_city&&this.Fa.more_city[y]){var E= this.Fa.more_city[y];A=0;for(var C=E.length;A<C;A++)for(var D=0,J=E[A].city.length;D<J;D++)w=E[A].city[D],m[y].push({city:w.name,Kz:w.code,numResults:w.num})}}else{w=B[y].count;t[y].push({count:w,aZ:B[y].page_num||0,total:760<B[y].total?760:B[y].total});for(A=0;A<w;A++)if(c&&(c[y]&&c[y][A])&&(C=c[y][A],C.addr!==p)){D=this.qH(C.addr,C.poiType);E=[];if(C.cla&&0<C.cla.length)for(J=C.cla.length;J--;)P=C.cla[J][1],P=P.replace("<b>","").replace("</b>",""),E.unshift(P);C={title:C.name,uid:C.uid,point:O.vb(C.geo, o).point,url:W.Nh(C.uid,d.code),detailUrl:"http://api.map.baidu.com/place/detail?uid="+C.uid+"&output=html&source=jsapi",address:D,city:d.name,province:d.up_province_name||"",phoneNumber:C.tel,postcode:C.zip,type:C.poiType||0,isAccurate:C.acc_flag&&1==C.acc_flag?o:q,tags:E};n[y].push(C);l.push(C.point);this.vf.push(C)}}}else for(y=A;y<b.count;y++){if(c&&c[y]&&(C=c[y],C.addr!==p)){D=this.qH(C.addr,C.poiType);E=[];if(C.cla&&0<C.cla.length)for(J=C.cla.length;J--;){var P=C.cla[J][1],P=P.replace("<b>", "").replace("</b>","");E.unshift(P)}C={title:C.name,uid:C.uid,point:O.vb(C.geo,o).point,url:W.Nh(C.uid,d.code),detailUrl:"http://api.map.baidu.com/place/detail?uid="+C.uid+"&output=html&source=jsapi",address:D,city:d.name,province:d.up_province_name||"",phoneNumber:C.tel,postcode:C.zip,type:C.poiType||0,isAccurate:C.acc_flag&&1==C.acc_flag?o:q};0<E.length&&(C.tags=E);k.push(C);l.push(C.point);this.vf.push(C)}}else i=g=1,C={title:c.cname,uid:c.uid,point:O.vb(c.geo,o).point,address:c.cname,url:z.wp+ "?s="+encodeURIComponent("s&wd="+b.wd)},k.push(C),this.vf.push(C),l.push(C.point)}else if(26==e&&(i=g=1,C={title:b.wd,point:O.fZ(c[0]),url:z.wp+"?s="+encodeURIComponent("s&wd="+b.wd)},k.push(C),this.vf.push(C),l.push(C.point)),7==e){for(y=i=g=0;y<c.length;y++)m.push({city:c[y].name,Kz:c[y].code,numResults:c[y].num});if(this.Fa.more_city){E=this.Fa.more_city;y=0;for(C=E.length;y<C;y++){A=0;for(J=E[y].city.length;A<J;A++)c=E[y].city[A],m.push({city:c.name,Kz:c.code,numResults:c.num})}}}this.rz=l;if(this.Fc){this.Ii= [];f=a.sd.length;b=o;for(y=0;y<f;y++)0<t[y].length&&0<t[y][0].total&&(b=q),k=new gh({tb:a.sd[y]||"",count:0<t[y].length?t[y][0].count:0,total:0<t[y].length?t[y][0].total:0,OE:0<t[y].length?t[y][0].aZ:0,city:d.name,province:d.up_province_name||"",Ew:d.code,Hk:n[y]||[],fC:m[y]||[],Bp:this.of(),Ga:a.Ga,xa:a.xa,$a:a.Ga&&a.xa?j:a.$a,ri:"",mO:v}),k.kB=a.Zc.qt,this.Ii.push(k);b?this.sb(2):this.sb(0);this.Sa(W.Sc,this.Ii)}else this.ja=new gh({tb:a.sd,count:i,total:g,OE:b.page_num,city:d.name,province:d.up_province_name|| "",Ew:d.code,Hk:k,fC:m,Bp:this.of(),Ga:a.Ga,xa:a.xa,$a:a.Ga&&a.xa?j:a.$a,ri:this.gv(a,d),mO:v}),this.ja.kB=a.Zc.qt,0==g&&7!=e?this.sb(2):7!=e?this.sb(0):this.sb(1),this.Sa(W.Sc,this.ja)},gv:function(a,b){var c="",c="string"==typeof a.Ga?a.Ga+" "+a.sd:a.sd,d=b.name,e,f,g;"object"==typeof a.Ga&&!(a.Ga instanceof H)&&(f=a.Ga.point,e=a.xa);a.$a&&!a.Ga&&(g=a.$a);a.Ga&&a.Ga instanceof H&&(f=a.Ga,e=a.xa);c=z.wc+"place/search?res=jsapi&query="+c+"&region="+d+"&output=html";f&&(c+="&location="+f.lat+","+f.lng+ "&radius="+e);g&&(e=g.ve(),g=g.nf(),c+="&bounds="+e.lat+","+e.lng+","+g.lat+","+g.lng);return c},qH:function(a,b){b=b||0;return 1==b||3==b?O.unique(a.split(";")).join("; "):a},J0:function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].qL())return o;return q},Kj:function(){for(var a=0,b=this.wa.length;a<b;a++)this.wa[a].remove(),this.wa[a]=p;a=this.wa.length=0;for(b=this.vf.length;a<b;a++)this.vf[a]=p;this.vf.length=0;this.Cz&&(this.Cz.remove(),this.Cz=p)},hA:function(){if(!this.Fc)return this.ja;for(var a, b=-1,c=0,d=this.Ii.length;c<d;c++){var e=this.Ii[c];e.ap()>b&&(a=e,b=e.ap())}return a},Pe:function(){delete this.Fa;delete this.Bd;delete this.ja;this.Fc&&delete this.Ii;delete this.ga;this.kb=-1;this.sb();this.Kj();this.k.ka.Ia&&(this.k.ka.Ia.innerHTML="")},Em:function(a){if(this.Ql)this.qs.Em(a);else if(this.ga){var b;b=this.Fc?this.hA():this.ja;if("number"==typeof a&&!isNaN(a)&&0<=a&&a<=b.ap()-1)switch(this.ga.Zc.pn=a,this.ga.Zc.qt){case "s":case "con":this.search(this.ga.Zc.wd,this.ga.options, this.ga);break;case "bd":this.bn(this.ga.Zc.wd,this.ga.$a,this.ga);break;case "nb":this.Lp(this.ga.Zc.wd,this.ga.Ga,this.ga.xa,this.ga);break;case "bda":this.bn(this.ga.sd,this.ga.$a,this.ga);break;case "sa":this.search(this.ga.sd,this.ga.options,this.ga);break;case "nba":this.Lp(this.ga.sd,this.ga.Ga,this.ga.xa,this.ga)}else this.sb(5),this.Sa(W.Sc)}},Nz:function(){this.qs||(this.qs=new hh(this))},select:function(a){this.$m.select(a);this.Zm.select(a);this.kb=a}}); T(ud,{gotoPage:ud.Em,searchNearby:ud.Lp,searchInBounds:ud.bn,search:ud.search,clearResults:ud.Pe});function gh(a){this.keyword=a.tb||"";this.rT=a.OE||0;this.bR=a.count||0;this.YA=a.total||0;this.iT=Math.ceil(a.total/a.Bp);this.center=a.Ga;this.radius=a.xa;this.bounds=a.$a;this.city=a.city;this.province=a.province;this.viewport=a.viewport;this.moreResultsUrl=a.ri;this.Ar=a.Hk&&a.Hk.slice(0)||[];this.yQ=a.fC&&a.fC.slice(0);this.suggestions=a.mO||[]}x.extend(gh.prototype,{xk:function(a){if(this.Ar[a])return this.Ar[a]},Xs:u("YA"),ap:u("iT"),qL:u("bR"),xL:u("rT"),jx:u("yQ"),toString:da("LocalResult")}); var ih=gh.prototype;T(ih,{getPoi:ih.xk,getCurrentNumPois:ih.qL,getNumPois:ih.Xs,getNumPages:ih.ap,getPageIndex:ih.xL,getCityList:ih.jx});function hh(a){x.lang.Ca.call(this);this.na=a;this.na.kb=-1}x.lang.ua(hh,x.lang.Ca,"CustomSearch"); x.extend(hh.prototype,{search:function(a){this.Mp=a.Mp;this.na.Fc=q;if(this.Dz(a)){var b=this;this.na.Ig(this.na.yd,function(c){a.region=c;c=b.iS(a);b.PN(c,{Zc:c,options:a})})}},Dz:function(){var a=o;pa||(this.na.sb(4),this.na.Sa(W.Sc),a=q);return a},iS:function(a){var b=this.Uw=a.Uw;b&&b.geotableId&&(this.ut=o);var c={region:a.region,page_size:this.na.of(),ak:pa};a.$Y&&(c.page_index=a.$Y);a.tb&&(c.q=a.tb);if(a.$a){var d=a.$a.ve(),e=a.$a.nf();c.bounds=this.ut?d.lng+","+d.lat+";"+e.lng+","+e.lat:d.lat+ ","+d.lng+";"+e.lat+","+e.lng}if(a.Ga&&(a.Ga instanceof H||a.Ga.point instanceof H))d=p,a.Ga instanceof H?d=a.Ga:a.Ga.point instanceof H&&(d=a.Ga.point),c.location=this.ut?d.lng+","+d.lat:d.lat+","+d.lng;"string"==typeof a.Ga&&(c.q=a.Ga+" "+a.tb,this.Mp="local");a.xa&&(c.radius=a.xa);this.ut?c.geotable_id=b.geotableId:b&&b.databoxId&&(c.filter="databox:"+b.databoxId);b.tags&&(c.tags=b.tags);b.filter&&(c.filter=b.filter);return c},PN:function(a,b){var c=this,d="geosearch/poi";this.ut&&(d="geosearch/v2/"+ this.Mp);cd.cb(function(a,b){c.Jf(a,b)},a,b,d)},Jf:function(a,b){this.na.Pe();this.na.ga=b;if(0!=a.status)this.ja=new gh({tb:b.options.tb,Bp:this.na.of(),Ga:b.options.Ga||"",xa:b.options.xa||"",$a:b.options.$a||"",ri:""}),5==a.status?this.na.sb(4):this.na.sb(2),this.na.ja=this.ja,this.na.Sa(W.Sc,this.ja),this.na.Zm.dispatchEvent("render");else{this.Fl(a,b);this.na.$m.dispatchEvent("render");this.na.Zm.dispatchEvent("render");var c=b.options.Ga;c&&("string"!=typeof c&&!(c instanceof H)&&0==this.na.zm())&& this.na.$m.ow(c);c={};c.ia=this.na.rz;this.na.$m.kL(c);c=this.na.ja;if(this.na.k.ka.Ot&&c&&0<c.Xs()){var d=this;setTimeout(function(){d.na.select(0)},240)}}},Fl:function(a,b){var c=a.content||{},d=[],e=[],f=this.ut;f&&(c=a.contents);for(var g=0,i=a.size;g<i&&c[g];g++){var k=c[g],l=f?new H(k.location[0],k.location[1]):new H(k.longitude,k.latitude);d.push({title:f?k.title:k.name,uid:k.uid,point:l,url:"",address:f?k.address:k.addr,city:k.city,province:k.province,phoneNumber:k.tel,postcode:k.zip,type:k.cla}); e.push(l)}this.na.vf=d;this.na.rz=e;this.ja=new gh({tb:b.options.tb,count:a.size,total:a.total,OE:b.Zc.page_index,city:"",province:"",Ew:"",Hk:d,Bp:this.na.of(),Ga:b.options.Ga,xa:b.options.xa,$a:b.options.$a,ri:""});0==a.total?this.na.sb(2):this.na.sb(0);this.na.ja=this.ja;this.na.Sa(W.Sc,this.ja)},Em:function(a){var b=this.na.ja;"number"==typeof a&&!isNaN(a)&&0<=a&&a<=b.ap()-1?(this.na.ga.Zc.page_index=a,this.PN(this.na.ga.Zc,this.na.ga)):(this.na.sb(5),this.na.Sa(W.Sc))}});function eh(a){x.lang.Ca.call(this);this.na=a;this.map=a.k.ka.map;this.wa=a.wa;this.ra()}x.lang.ua(eh,x.lang.Ca,"RenderMap"); x.extend(eh.prototype,{ra:function(){this.addEventListener("render",this.Aa)},Aa:function(){if(this.map){for(var a=this,b=this.na.vf,c=[],d=0,e=b.length;d<e;d++){var f=b[d];c.push(f.point);var g=this.VP(f.point,d,f.title);g&&(f.marker=g,function(){var b=d;g.addEventListener("click",function(){a.na.select(b)})}(),this.wa.push(g))}this.na.Sa(W.bq,b)}},ow:function(a){var b=this;if(a&&"string"!=typeof a&&!(a instanceof H)){var c=this.na.Cz=V.ow(this.map,a.point,a.title);c.addEventListener("click",function(){b.na.select(-1); b.na.kb="c";var d=b.dH(a);c.Ob(d)})}},VP:function(a,b,c){return this.na.k.Gk<=ab.fq&&!this.na.Fc?V.RU(this.map,a,b,c):V.QU(this.map,a,c)},select:function(a){if(this.map&&-1<a&&this.wa[a]){if(G())for(var b=p,c=0,d=this.wa.length;c<d;c++)b=this.wa[c],a==c?b.Vb(b.WL):b.Vb(b.dE),b.draw;else{c=0;for(d=this.wa.length;c<d;c++)b=this.wa[c],b.yi(q)}this.map.Wc();if(b=this.na.vf[a])b=this.dH(b),a=this.wa[a],a.yi(o),a.Ob(b)}},dH:function(a){var b=V.VV({title:a.title,$r:a.address,C_:a.phoneNumber,url:a.url,fW:a.detailUrl, uid:a.uid,UE:a.type}),c=this;b.addEventListener("close",function(){c.na.Zm.CV()});b.addEventListener("open",function(){c.na.Sa(W.Bn,a,V.Us(c.map))});return b},kL:function(a){var b=this.na.k.ka;if(this.map)if(a.ia){var c=!b.Wg,b=!b.Ot&&b.Wg,a=this.map.bt(a.ia,{margins:[30,30,30,30]});c||this.map.zh(a,{enableAnimation:b})}else a.tg=O.gx(a.tg,this.map),b.Wg&&this.map.Dd(a.Ga,a.tg)}});function fh(a){x.lang.Ca.call(this);this.na=a;this.Ia=a.k.ka.Ia;this.ra()}x.lang.ua(fh,x.lang.Ca,"RenderList"); x.extend(fh.prototype,{ra:function(){this.addEventListener("render",this.Aa)},Aa:function(){if(this.Ia){var a=K("div",{style:"font:12px "+F.fontFamily+";border:1px solid #999;"}),b=K("div",{style:"background:#fff"}),c=K("ol",{style:"list-style:none;padding:0;margin:0"}),d=this.na.zm(),e=p;if(0==d)for(var e=0,f=this.na.vf.length;e<f;e++)d=this.QQ(e),c.appendChild(d);else if(1==d){if(1==d&&!this.na.Fc){e=0;for(f=Math.min(6,this.na.ja.jx().length);e<f;e++)d=this.OQ(e),c.appendChild(d)}}else{e="";switch(d){case 2:e= "\\u62b1\\u6b49\\uff0c\\u672a\\u627e\\u5230\\u76f8\\u5173\\u5730\\u70b9\\u3002";break;case 4:e="\\u62b1\\u6b49\\uff0c\\u60a8\\u6240\\u63d0\\u4f9b\\u7684key\\u65e0\\u6548\\u3002"}d=K("li",{style:"margin:2px 0;padding:0 5px 0 3px;overflow:hidden;line-height:17px"});d.innerHTML=e;c.appendChild(d)}b.appendChild(c);a.appendChild(b);e=this.WQ();a.appendChild(e);this.Ia.appendChild(a);this.na.Sa(W.Au,a)}},QQ:function(a){var b=this.na.vf;if(b&&b[a]){var b=b[a],c=K("li",{style:"margin:2px 0;padding:0 5px 5px 0px;cursor:pointer;overflow:hidden;line-height:17px;*zoom:1;"}); -1<this.na.kb&&a==this.na.kb&&(c.style.backgroundColor="#f0f0f0");var d=0==a?"0px":"-"+25*a+"px";if(this.na.k.Gk>ab.fq||this.na.Fc)d="-275px";var d=["<span style=\'background:url("+z.wc+"images/markers.png) -23px "+d+" no-repeat;width:19px;height:25px;cursor:pointer;float:left;*zoom:1;overflow:hidden;margin:2px 3px 0 5px;*margin-right:0px;display:inline;\'>&nbsp;</span>"],e,f=RegExp(this.na.Fc?this.na.ga.sd.join("|"):this.na.ja.keyword,"ig");b.title&&(e=b.title.replace(f,"<b>$&</b>"));1==b.type?e+= "-\\u516c\\u4ea4\\u8f66\\u7ad9":3==b.type&&(e+="-\\u5730\\u94c1\\u7ad9");d.push("<div style=\'zoom:1;overflow:hidden;padding:0 5px;\'>");d.push("<div style=\'line-height:20px;font-size:12px;\'><span style=\'color:#00c;\'>"+e+"</span>");b.detailUrl&&d.push("<a target=\'_blank\' href=\'"+b.detailUrl+"\' style=\'margin-left:5px;font-size:12px;color:#3d6dcc;font-weight:normal;text-decoration:none;\'>\\u8be6\\u60c5&raquo;</a>");d.push("</div>");b.address&&(e=b.address.replace(f,"<b>$&</b>"),d.push("<div style=\'padding:2px 0;line-height:18px;*zoom:1;overflow:hidden;\'><b style=\'float:left;font-weight:bold;*zoom:1;overflow:hidden;padding-right:5px;*margin-right:-3px;\'>\\u5730\\u5740:</b><span style=\'color:#666;display:block;zoom:1;overflow:hidden;\'>"+ e+"</span></div>"));b.phoneNumber&&d.push("<div style=\'padding:2px 0;line-height:18px;*zoom:1;overflow:hidden;\'><b style=\'float:left;font-weight:bold;*zoom:1;overflow:hidden;padding-right:5px;*margin-right:-3px;\'>\\u7535\\u8bdd:</b><span style=\'color:#666;\'>"+b.phoneNumber+"</span></div>");d.push("</div>");c.innerHTML=d.join("");var g=this;c.onclick=function(){g.na.select(a)};return c}},WQ:function(){var a=this,b=K("div",{style:"white-space:nowrap;text-align:right;background:#e5ecf9;margin-top:5px;padding:2px;overflow:hidden;zoom:1;"}); if(!this.na.Fc&&!this.na.Ql){var c=K("a",{style:"color:#7777cc;float:right;",href:this.na.ja.moreResultsUrl,target:"_blank",title:"\\u5230\\u767e\\u5ea6\\u5730\\u56fe\\u67e5\\u770b\\u66f4\\u591a\\u7ed3\\u679c"});c.innerHTML="\\u66f4\\u591a\\u7ed3\\u679c&#187;";b.appendChild(c)}var c=K("div",{style:"float:left;margin-right:5px"}),d=this.na.hA();0<this.na.vf.length&&new td(c,function(b){a.na.Em(b-1)},{Jd:d.ap(),page:d.xL()+1,update:q});b.appendChild(c);return b},CV:function(){this.Ia&&("number"==typeof this.na.kb&& -1!=this.na.kb&&this.Ia.getElementsByTagName("li")[this.na.kb])&&(this.Ia.getElementsByTagName("li")[this.na.kb].childNodes[1].style.backgroundColor="");this.na.kb=-1},select:function(a){if(this.Ia){var b=this.na.kb;"number"==typeof b&&(-1!=b&&this.Ia.getElementsByTagName("li")[b])&&(this.Ia.getElementsByTagName("li")[b].childNodes[1].style.backgroundColor="");"number"==typeof a&&(-1!=a&&this.Ia.getElementsByTagName("li")[a])&&(this.Ia.getElementsByTagName("li")[a].childNodes[1].style.backgroundColor= "#f0f0f0")}},OQ:function(a){var b=K("li",{style:"margin:2px 0;padding:0 5px 0 3px;cursor:pointer;overflow:hidden;line-height:17px"});b.Sj=a;var c=this.na.ja.jx();b.innerHTML="<span style=\'color:#00c;text-decoration:underline\'>"+c[a].city+"</span> <span style=\'color:#666\'>(\\u5171"+c[a].numResults+"\\u6761\\u7ed3\\u679c)</span>";var d=this.na,e=d.ja;b.onclick=function(){d.gn(e.jx()[a].city);d.search(e.keyword)};return b}}); ');