const client = require('./server/conexion') // Importa la conexión de la base de datos

function getProductDetails(productID) {
    return new Promise(async (resolve, reject) => {
        try {
            const productQuery = await client.query('SELECT * FROM libro WHERE libro_id = $1', [productID]);
            if (productQuery.rowCount === 0) {
                console.log('No existe ese registro');
                resolve(null);
            } else {
                const productDetails = productQuery.rows[0];
                //Query para el obtener los autores
                const authorsQuery = await client.query(
                    'SELECT a.autor_id, a.nombre_autor ' +
                    'FROM autor AS a ' +
                    'INNER JOIN autores_libros AS al ON a.autor_id = al.autor_id ' +
                    'WHERE al.libro_id = $1',
                    [productID]
                );

                // Obtener los identificadores y nombres de los autores
                const authors = authorsQuery.rows.map(author => ({
                    autor_id: author.autor_id,
                    nombre_autor: author.nombre_autor
                }));

                productDetails.authors = authors;
                resolve(productDetails);
            }
        } catch (error) {
            console.log('Error en la consulta SQL:', error);
            reject(error);
        }
    });
}
async function getFeaturedBooks() {
    try {
        // Realiza una consulta SQL para obtener los libros más vendidos
        const query = `
            SELECT titulo_libro, autor_libro, total_vendido
            FROM vista_libros_mas_vendidos
            ORDER BY total_vendido DESC
            LIMIT 5; 
        `

        const result = await client.query(query)
        return result.rows // Devuelve la lista de libros más vendidos
    } catch (error) {
        console.error('Error al obtener los libros más vendidos:', error)
        throw error
    }
}

module.exports = { getFeaturedBooks, getProductDetails };
