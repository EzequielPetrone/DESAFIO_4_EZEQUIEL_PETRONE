# DESAFIO_4_EZEQUIEL_PETRONE

Al final decidí hacer un endpoint aparte para procesar el FORM del Frontend ya que quise hacer un tratamiento particular con las imágenes.
El usuario si no tiene URL de una imagen, puede hacer el upload de una, esa imagen "se guarda en el servidor" y su ubicación pública es el thumbnail del producto en cuestión.

En caso que el form no tenga la opción de subir imágenes y te obligue a poner una URL, sí podría haber usado el mismo endpoint de post que testeo a través del postman, armando el objeto en cuestión desde la lógica del frontend y listo.

NOTA: googleando aprendí el método assign() de la clase Object. Muy interesante. Lo usé en el método editById de la clase Contenedor (el cuál uso en el endpoint de PUT).