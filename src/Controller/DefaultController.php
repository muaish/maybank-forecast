<?php

//src/Controller/DefaultController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class DefaultController extends AbstractController
{
    #[Route("/", name: "home_page")]
    public function index(): Response
    {
        return $this->render('base.html.twig', [
            'page_title' => '',
            'page_content' => '<h1>Price History and Performance</h1><div id = "chart"></div>'
        ]);
    }
}