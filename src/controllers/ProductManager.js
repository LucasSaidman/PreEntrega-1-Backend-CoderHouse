const fs = require("fs").promises;

class ProductManager {

    static id = 10;

    constructor(path) {

        this.products = [];
        this.path = path;

    }

    async addProduct({title, description, price, thumbnail, code, stock}) {

        try {

            const arrayProductos = await this.leerArchivo();
      
            if (!title || !description || !price || !thumbnail || !code || !stock) {

              console.log("Todos los campos son obligatorios");
              return;

            }
      
            if (arrayProductos.some(item => item.code === code)) {

              console.log("El código debe ser único");
              return;

            }

            if (arrayProductos.length > 0) {

                ProductManager.id = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
  
            }
      
            const newProduct = {
                id: ++ProductManager.id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
      
            arrayProductos.push(newProduct);
            await this.guardarArchivo(arrayProductos);

          } catch (error) {

            console.log("Error al agregar producto", error);
            throw error; 

          }

    }

    async getProducts() { 

        try {

            const readProductsJSON = await fs.readFile(this.path, "utf-8");

            if (readProductsJSON.length > 0) {

                this.products = JSON.parse(readProductsJSON);
                console.log(this.products);
                return this.products;
                
            } else {

                console.log("No se encontro nada en el archivo JSON");
                return [];

            }

        } catch (error) {

            console.log("getProduct no pudo leer el archivo JSON: ", error.message);

        }

    }

    async getProductById(id){

        try {

            const readProductsJSON = await fs.readFile(this.path, "utf-8");

            if( !readProductsJSON || readProductsJSON.trim() === "") {

                console.log("JSON esta vacio");
                return "JSON esta vacio";

            }

            this.products = JSON.parse(readProductsJSON);

            const productoEncontrado = this.products.find(product => product.id == id);

            if(productoEncontrado) {

                console.log(productoEncontrado);
                return productoEncontrado;

            } else {

                console.log("No encontrado");
                return "No encontrado";

            }

        } catch (error) {

            console.log("getProductById no pudo leer el archivo JSON: ", error.message)

        }

    }


    async leerArchivo() {

        try {

            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;

        } catch (error) {

            console.log("Error al leer un archivo", error);
            throw error;

        }

    }
    
    async guardarArchivo(arrayProductos) {

        try {

            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));

        } catch (error) {

            console.log("Error al guardar el archivo", error);
            throw error;

        }

    }


    async updateProduct(id, productoActualizado) {

        try {

            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);
      
            if (index !== -1) {

              arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
              await this.guardarArchivo(arrayProductos);
              console.log("Producto actualizado");

            } else {

              console.log("No se encontró el producto");

            }

        } catch (error) {

            console.log("Error al actualizar el producto", error);
            throw error;

        }
        
    }

    async deleteProduct(id) {

        try {

            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);
      
            if (index !== -1) {

              arrayProductos.splice(index, 1);
              await this.guardarArchivo(arrayProductos);
              console.log("Producto eliminado");

            } else {

              console.log("No se encontró el producto");

            }

        } catch (error) {

            console.log("Error al eliminar el producto", error);
            throw error;

        }
    }

}

const producto = new ProductManager();


//Productos de prueba para agregar:
//producto.addProduct("Teclado", 'Logitech G413 Carbon', 55000, "https://d2r9epyceweg5n.cloudfront.net/stores/001/715/976/products/teclado-logitech1-a0d0f03734ef17c46216506377238422-1024-1024.jpg", "G413", 15);
//producto.addProduct("Microfono", 'HyperX Quadcast', 78000, "https://cellplay.com.ar/img/Public/producto-137331-0.jpg", "HX-QC", 10);


//producto.getProducts();
//producto.getProductById(4);
//producto.updateProduct(10, "title", "PC");
//producto.deleteProduct(12);



module.exports = ProductManager;