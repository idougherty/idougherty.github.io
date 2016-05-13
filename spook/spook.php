<?php

ob_start();

header("Content-type: text/xml");
echo "<?xml version='1.0' encoding='UTF-8'?>";
echo "<spook activated='false' />";

ob_end_clean();

ob_start();

header("Content-type: text/xml");
echo "<?xml version='1.0' encoding='UTF-8'?>";
echo "<spook activated='true' />";

ob_end_clean();

sleep(time()+5);

ob_start();

header("Content-type: text/xml");
echo "<?xml version='1.0' encoding='UTF-8'?>";
echo "<spook activated='false' />";

?>