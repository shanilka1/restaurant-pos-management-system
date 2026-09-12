<?php

/**
 * Vercel Serverless Function entry point for Laravel
 */

if (!file_exists('/tmp/database.sqlite')) {
    touch('/tmp/database.sqlite');
    // Run migrations silently on cold start
    putenv('DB_CONNECTION=sqlite');
    putenv('DB_DATABASE=/tmp/database.sqlite');
}

require __DIR__ . '/../public/index.php';
