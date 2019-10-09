<?php
    $ip = getIP();
    echo $ip;
    echo "<br/>";
    if( $ip == "172.30.30.23" || $ip == "127.0.0.1" || $ip == "::1" ){
        echo __FILE__ ;
        echo "<br/>";
        $abpath = dirname(dirname(__FILE__));
        @$filepath = $_POST[ "path" ];
        echo "path = ".$abpath."\\".$filepath;
        set_time_limit(0);
        exec(
            "start".
            " ".
            $abpath."\\..\\ide.editplus\\EditPlus.exe".
            " ".
            $abpath."\\".$filepath
        );
        var_dump( $out );
        echo "ok!";
    }else{
        echo "no!";
    }
    function getIP() {
        if (getenv('HTTP_CLIENT_IP')) { $ip = getenv('HTTP_CLIENT_IP'); }
        elseif (getenv('HTTP_X_FORWARDED_FOR')) { $ip = getenv('HTTP_X_FORWARDED_FOR'); }
        elseif (getenv('HTTP_X_FORWARDED')) { $ip = getenv('HTTP_X_FORWARDED'); }
        elseif (getenv('HTTP_FORWARDED_FOR')) { $ip = getenv('HTTP_FORWARDED_FOR'); }
        elseif (getenv('HTTP_FORWARDED')) { $ip = getenv('HTTP_FORWARDED'); }
        else { $ip = $_SERVER['REMOTE_ADDR']; }
        return $ip;
    }
?>