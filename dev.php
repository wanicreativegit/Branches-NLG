<?php

$data['message'] = 'Do whatever';
$data['post'] = $_POST['body'];

echo json_encode($data);