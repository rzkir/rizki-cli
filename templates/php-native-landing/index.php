<?php
require_once __DIR__ . '/config/db.php';
?>

<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Your Company - Lorem Ipsum is simply dummy text of the printing and typesetting industry.">
    <meta name="keywords" content="Lorem Ipsum is simply dummy text of the printing and typesetting industry.">
    <meta name="author" content="Your Company">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="http://localhost:8000/">
    <meta property="og:title" content="Your Company - Lorem Ipsum is simply dummy text of the printing and typesetting industry.">
    <meta property="og:description" content="Lorem Ipsum is simply dummy text of the printing and typesetting industry.">
    <meta property="og:image" content="http://localhost:8000/favicon.ico">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="http://localhost:8000/">
    <meta property="twitter:title" content="Your Company - Lorem Ipsum is simply dummy text of the printing and typesetting industry.">
    <meta property="twitter:description"
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry.">
    <meta property="twitter:image" content="http://localhost:8000/favicon.ico">

    <!-- Canonical URL -->
    <link rel="canonical" href="http://localhost:8000/" />

    <title>Your Company</title>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Boxicons -->
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    <!-- Custom CSS -->
    <link rel="stylesheet" href="style/globals.css">

    <!-- AOS Animation CSS -->
    <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />

    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">

    <!-- Breadcrumb Structured Data -->
    <script src="/js/breadchumb.js"></script>
</head>

<body>
    <?php require_once __DIR__ . '/layout/Header.php'; ?>
    <main class="overflow-hidden">
        <section>
            <h1>Hallo Worlds</h1>
        </section>
    </main>

    <!-- AOS Animation JS -->
    <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
    <script src="js/main.js"></script>

    <?php require_once __DIR__ . '/layout/Footer.php'; ?>