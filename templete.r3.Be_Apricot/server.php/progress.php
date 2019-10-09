<?php
    //开始上传
    //注意：文件是windows系统的文件，采用的gbk编码，php文件使用的是utf-8编码
    //我们不能直接修改文件的编码，只能临时修改一下php的编码
    $dst_file = $_FILES['file']['name'];
    $dst_file = iconv('utf-8', 'gbk', $dst_file);
    if(move_uploaded_file($_FILES['file']['tmp_name'],$dst_file)){
        $data['status'] = 1;
    }else{
        $data['status'] = 0;
    }
    echo json_encode($data);