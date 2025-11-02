export default function ProductsPage() {
  return (
    <div>
      <h1>teste</h1>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-panel rounded-md px-4 py-2 w-1/3 outline-none text-white"
          />
          <button className="bg-accent text-black px-5 py-2 rounded-md font-semibold">
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-panel rounded-lg h-48 p-4">Main Panel</div>
          <div className="bg-panel rounded-lg h-48 p-4">Side Panel</div>
          <div className="col-span-3 bg-panel rounded-lg h-64 p-4">Bottom Panel</div>
        </div>
      </div>
    </div>
  );
}
