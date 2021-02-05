	//实例化WafFileUploader对象
	var fileUploader = new jc.js.util.FileUploader();

	fileUploader.requestUrl = "//jsonplaceholder.typicode.com/posts/";
	fileUploader.filePathClassName = ".filePath";
	fileUploader.fileMaxSize = 2048000;
	//fileUploader.requestUrl = "http://127.0.0.1:8080/jc.content.open/single_file_recv";
	//fileUploader.requestUrl ="http://127.0.0.1:8080/jc.fileupload.webapi/single_file_recv";
	fileUploader.productId="content";//产品编号
	fileUploader.subProductId="qianyu";//子产品编号
	fileUploader.prefix="http://";//子产品编号
	
	//执行bindEvent方法绑定事件
	fileUploader.init();
	
	//实例化WafFileUploader对象
	var fileUploader2 = new jc.js.util.FileUploader(".jc_file_uploader_wrap_sub_img2");

	fileUploader2.requestUrl = "//jsonplaceholder.typicode.com/posts/";
	fileUploader2.filePathClassName = ".filePath";
	//fileUploader2.fileMaxSize = 2048000;

	//fileUploader.requestUrl = "http://127.0.0.1:8080/jc.content.open/single_file_recv";
	//fileUploader.requestUrl ="http://127.0.0.1:8080/jc.fileupload.webapi/single_file_recv";
	fileUploader2.productId="user";//产品编号
	fileUploader2.subProductId="qianyu";//子产品编号
	
	//执行bindEvent方法绑定事件
	fileUploader2.init();
