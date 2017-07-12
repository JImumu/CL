var jc=jc||{};
    jc.js=jc.js||{};
    jc.js.util=jc.js.util||{};

(function(nameSpace){
	function FileUploader(wrapClassName){
		var	_FileUploader = this;
		this.fileClassName = ".jc_fileUploader_fileDom";
		this.requestUrl = undefined;
		this.fileDomWidth = undefined;
		this.progressWidth = undefined;
		this.progressHeight = undefined;
		this.filePathClassName = undefined;
		this.fileMaxSize = undefined || 10240000;
		this.prefix = undefined;
		this.thumbHeight = "100px";
		this.wrapClassName = wrapClassName||".jc_file_uploader_wrap";
		this.productId = "default";
		this.subProductId = "default";
		this.whenToUpLoad = "change";
		this.onFileChange = function(onDataArrival,requestUrl,fileDom){
			if(""==fileDom.value)
				return;
			//改变状态提示
			$(fileDom).siblings(".jc_fileUploader_status").html("文件上传中");
			//获取file对象
			var fileObj = fileDom.files[0];
			if(_FileUploader.fileMaxSize <= fileObj.size){
				$(fileDom).siblings(".jc_fileUploader_status").html("文件大小超出限制 不可大于"+_FileUploader.fileMaxSize/1000/1024+"M").
				siblings(".jc_fileUploader_progress_number").html('').
				siblings(".jc_fileUploader_progress_wrap").find(".jc_fileUploader_progress").width(0).
				parent().parent().siblings(_FileUploader.filePathClassName).val("");
				return;
			};
			var dest = requestUrl;
			var fd = new FormData();
			var xhr;  
		    if(window.XMLHttpRequest){  
		        xhr=new XMLHttpRequest();
		    }else if(window.ActiveXObject){  
		        var activeName=["MSXML2.XMLHTTP","Microsoft.XMLHTTP"];  
		        for(var i=0;i<activeName.length;i++){  
		            try{  
		                xhr=new ActiveXObject(activeName[i]);  
		                break;  
		            }catch(error){}
		        };
		    };
			fd.append("file", fileObj);
			fd.append("productId",_FileUploader.productId);
			fd.append("subProductId",_FileUploader.subProductId);
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4 ) {
					if(xhr.status == 200){
						try{
							var responseText = JSON.parse(xhr.responseText);
						}catch(e){
							var responseText = xhr.responseText;
						}
						//改变状态提示
						//$(fileDom).siblings(".jc_fileUploader_status").html("文件上传完毕");
						//执行回调
						//参数:responseText表示服务器返回数据，fileDom表示file输入框
						onDataArrival&&onDataArrival(responseText,fileDom);
					}else{
						//改变状态提示
						$(fileDom).siblings(".jc_fileUploader_status").html("文件上传失败"+(xhr.status?"，错误代码："+xhr.status:"")).
						siblings(".jc_fileUploader_progress_number").html('').
						siblings(".jc_fileUploader_progress_wrap").find(".jc_fileUploader_progress").width(0).
						parent().parent().siblings(_FileUploader.filePathClassName).val("");
						_FileUploader.showImg();
					}
				}
			};
			//绑定xhr的传输事件
	 		xhr.upload.onprogress = function(event){
				if (event.lengthComputable) {
					var percentComplete = Math.round(event.loaded * 100 / event.total);
					$(fileDom).siblings(".jc_fileUploader_progress_number").html(percentComplete + "%").siblings(".jc_fileUploader_progress_wrap").find(".jc_fileUploader_progress").css("width",percentComplete + "%");
				}
			};
			xhr.ontimeout = function(){
				//改变状态提示
				$(fileDom).siblings(".jc_fileUploader_status").html("连接超时");
			};
			xhr.open("POST", dest, true);
			xhr.send(fd);
		};
		this.onFilePathBlur = function(){
			_FileUploader.showImg();
		};
		this.onFileClick = function (){
			//改变状态提示
			!this.onUploading
			&&$(this).val("").
			//改变状态提示
			siblings(".jc_fileUploader_status").html("请选择文件").
			siblings(".jc_fileUploader_progress_number").html('').
			siblings(".jc_fileUploader_progress_wrap").find(".jc_fileUploader_progress").width(0);
		};
		this.onDataArrival = function onDataArrival(resp,fileDom){
			if(resp.statusCode == "suc"){
				if(!_FileUploader.filePathClassName){
					alert("字段filePathClassName is undefined")
					console.error("字段filePathClassName is undefined");
					return;
				};
				$(fileDom).siblings(".jc_fileUploader_status").html("文件上传完毕");
				$(fileDom).parent().siblings(_FileUploader.filePathClassName).val(resp.url);
			}else{
				//改变状态提示
				$(fileDom).siblings(".jc_fileUploader_status").html(resp.statusText).
				siblings(".jc_fileUploader_progress_number").html('').
				siblings(".jc_fileUploader_progress_wrap").find(".jc_fileUploader_progress").width(0).
				parent().parent().siblings(_FileUploader.filePathClassName).val("");
			}
			_FileUploader.showImg();
		};
	}
	FileUploader.prototype.initView = function(){
		var _FileUploader = this;
		//生成提示HTML
		var upLoaderComponent='<input class="jc_fileUploader_fileDom" type="file">'+
						'<div class="jc_fileUploader_progress_wrap">'+
							'<p class="jc_fileUploader_progress"></p>'+
						'</div>'+
						'<span class="jc_fileUploader_progress_number" ></span>'+
						'<span class="jc_fileUploader_status">请选择文件</span>'+
						'<br><a href="" target="_blank;"><img class="jc_fileUploader_img" src="" /></a>';
		//插入提示HTML
		$(function(){
			$(_FileUploader.wrapClassName).html(upLoaderComponent);
			//编辑样式
			_FileUploader.fileDomWidth && $(_FileUploader.wrapClassName).find(".jc_fileUploader_fileDom").css("width",_FileUploader.fileDomWidth);
			_FileUploader.progressWidth && $(_FileUploader.wrapClassName).find(".jc_fileUploader_progress_wrap").css("width",_FileUploader.progressWidth);
			_FileUploader.progressHeight && $(_FileUploader.wrapClassName).find(".jc_fileUploader_progress_wrap").css("height",_FileUploader.progressHeight);
			_FileUploader.showImg();
		});
	}
	FileUploader.prototype.bindEvent = function(){
		if(undefined == this.requestUrl){
			console.error("字段requestUrl is undefined");
			alert("字段requestUrl is undefined");
		};
		var _FileUploader = this;
		$(function(){
			$(_FileUploader.wrapClassName).each(function(index,ele){
				//绑定change事件
				$(ele).find(_FileUploader.fileClassName).on(_FileUploader.whenToUpLoad,function(){
					_FileUploader.onFileChange(_FileUploader.onDataArrival,_FileUploader.requestUrl,this)
				});
				$(ele).find(_FileUploader.fileClassName).on("click",_FileUploader.onFileClick);
				$(ele).siblings(_FileUploader.filePathClassName).on("blur",_FileUploader.onFilePathBlur);
			});
		});
	}
	FileUploader.prototype.showImg = function(){
		var _FileUploader = this;
		$(this.wrapClassName).each(function(index,ele){
			var filePath = $(ele).siblings(_FileUploader.filePathClassName).val();
			var isImg = /^(\s|\S)+(gif|GIF|jpeg|JPEG|tif|jpg|png|JPG|PNG)+$/.test(filePath);
			if(isImg){
				if(filePath){
					if(/^http/.test(filePath)){
						filePath = filePath;
					}else{
						filePath = _FileUploader.prefix ? (_FileUploader.prefix + filePath) :filePath;
					}
					$(ele).find("a").prop("href",filePath)
					.find(".jc_fileUploader_img").prop("src",filePath).height(_FileUploader.thumbHeight);
				}
			}
			else
				$(ele).find("a").prop("href",'')
			.find(".jc_fileUploader_img").prop("src","");
			
		});
	}
	FileUploader.prototype.init = function(){
		this.initView();
		this.bindEvent();
	}
	nameSpace.FileUploader = FileUploader;
})(jc.js.util);