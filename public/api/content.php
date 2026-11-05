<?php
require __DIR__ . '/_lib.php';

header('Cache-Control: no-cache, must-revalidate');
json_response(load_content());
