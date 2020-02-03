<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <link rel="stylesheet" href="./styles.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,400">
    </head>
    <body>
        <header>
            <h2>Creación y envío de formularios desde el DOM</h2>
        </header>
        <p>
            Este es el resultado de crear un formulario en tiempo de ejecución y recibir el formulario
        </p>

        <h2>Resultado</h2>
        <?php
            foreach ($_POST as $key => $value) {
                echo "Field ".htmlspecialchars($key)." is ".htmlspecialchars($value)."<br>";
            }
        ?>
    </body>
</html>

