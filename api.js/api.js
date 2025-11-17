const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  }

  /**
   * List all products
   * @param {object} req
   * @param {object} res
   */
  async function listProducts(req, res) {
    const { offset = 0, limit = 25, tag } = req.query;

    try {
      res.json(await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag,
      }))
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }


async function getProduct(req, res, next) {
    const { id } = req.params;

    try {
      const product = await Products.get(id)
      if (!product) {
        return next()
      }

      return res.json(product)

    } catch(err) {
      res.status(500).json({ error: err.message })
    }

}

async function createProduct(req, res) {
  console.log('request body', req.body)
  res.json(req.body)
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  const products = JSON.parse(await fs.readFile(productsFile));
  const index = products.findIndex(p => p.id == id);
  if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(index, 1);
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

  res.status(204).send();
}
async function updateProduct(req, res) {
  const { id } = req.params;
  const updatedData = req.body;

  const products = JSON.parse(await fs.readFile(productsFile));
  const product = products.find(p => p.id == id);
  if (!product) {
      return res.status(404).json({ error: 'Product not found' });
  }

  Object.assign(product, updatedData);
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

  res.json(product);
}


  module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
  });