<?php

namespace App\Service;

class AppUtil
{
    public function getData(string $filepath): array
    {
        $data = [];
        if (($handle = fopen($filepath, "r")) !== FALSE) {
            while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
                
                $data[] = [
                    'date' => $row[0],
                    'close' => $row[1],
                ];
            }
            fclose($handle);
        }
        return $data;
    }
}

