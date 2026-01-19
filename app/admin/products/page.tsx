'use client'
import { useState, useRef } from 'react';
import { useData, Product } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Plus, Edit, Trash2, Search, Upload, FileSpreadsheet, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Textarea } from '../../components/ui/textarea';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{
    success: number;
    errors: Array<{ row: number; message: string }>;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    originalPrice: '',
    image: '',
    description: '',
    stock: '',
    sku: '',
    rating: '5',
    country: 'USA',
    reviews: '0',
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        brand: product.brand || '',
        category: product.category,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        image: product.image,
        description: product.description || '',
        stock: product.stock.toString(),
        sku: product.sku,
        rating: product.rating.toString(),
        country: product.country,
        reviews: product.reviews.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        category: categories[0]?.name || '',
        price: '',
        originalPrice: '',
        image: '',
        description: '',
        stock: '',
        sku: '',
        rating: '5',
        country: 'USA',
        reviews: '0',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      brand: formData.brand || undefined,
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: formData.image,
      description: formData.description || undefined,
      stock: parseInt(formData.stock),
      sku: formData.sku,
      rating: parseInt(formData.rating),
      country: formData.country,
      reviews: parseInt(formData.reviews),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      handleCSVImport(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      handleExcelImport(file);
    } else {
      setImportStatus({
        success: 0,
        errors: [{ row: 0, message: 'Unsupported file format. Please use CSV or Excel (.xlsx, .xls)' }],
      });
    }
  };

  const handleCSVImport = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processImportData(results.data as any[]);
      },
      error: (error) => {
        setImportStatus({
          success: 0,
          errors: [{ row: 0, message: `Error parsing CSV: ${error.message}` }],
        });
      },
    });
  };

  const handleExcelImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        processImportData(jsonData as any[]);
      } catch (error: any) {
        setImportStatus({
          success: 0,
          errors: [{ row: 0, message: `Error parsing Excel: ${error.message}` }],
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processImportData = (data: any[]) => {
    const errors: Array<{ row: number; message: string }> = [];
    let successCount = 0;

    data.forEach((row, index) => {
      try {
        // Map CSV/Excel columns to product fields (case-insensitive)
        const getValue = (keys: string[]) => {
          for (const key of keys) {
            const value = row[key] || row[key.toLowerCase()] || row[key.toUpperCase()];
            if (value !== undefined && value !== null && value !== '') {
              return String(value).trim();
            }
          }
          return '';
        };

        const name = getValue(['name', 'product name', 'product_name', 'title']);
        const category = getValue(['category', 'cat', 'product category', 'product_category']);
        const price = getValue(['price', 'product price', 'product_price', 'cost']);
        const sku = getValue(['sku', 'product sku', 'product_sku', 'code']);
        const image = getValue(['image', 'image url', 'image_url', 'imageUrl', 'picture', 'photo']);
        const stock = getValue(['stock', 'quantity', 'qty', 'inventory', 'stock quantity']);
        const brand = getValue(['brand', 'manufacturer', 'maker']);
        const originalPrice = getValue(['original price', 'original_price', 'originalPrice', 'msrp', 'list price']);
        const description = getValue(['description', 'desc', 'details', 'product description']);
        const rating = getValue(['rating', 'stars', 'review rating']) || '5';
        const country = getValue(['country', 'origin', 'made in']) || 'USA';
        const reviews = getValue(['reviews', 'review count', 'review_count', 'num reviews']) || '0';

        // Validation
        if (!name) {
          errors.push({ row: index + 2, message: `Row ${index + 2}: Product name is required` });
          return;
        }
        if (!category) {
          errors.push({ row: index + 2, message: `Row ${index + 2}: Category is required` });
          return;
        }
        if (!price || isNaN(parseFloat(price))) {
          errors.push({ row: index + 2, message: `Row ${index + 2}: Valid price is required` });
          return;
        }
        if (!sku) {
          errors.push({ row: index + 2, message: `Row ${index + 2}: SKU is required` });
          return;
        }
        if (!image) {
          errors.push({ row: index + 2, message: `Row ${index + 2}: Image URL is required` });
          return;
        }
        if (!stock || isNaN(parseInt(stock))) {
          errors.push({ row: index + 2, message: `Row ${index + 2}: Valid stock quantity is required` });
          return;
        }

        // Check if SKU already exists
        const existingProduct = products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
        if (existingProduct) {
          errors.push({ row: index + 2, message: `Row ${index + 2}: SKU "${sku}" already exists` });
          return;
        }

        // Add product
        addProduct({
          name,
          brand: brand || undefined,
          category,
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
          image,
          description: description || undefined,
          stock: parseInt(stock),
          sku,
          rating: parseInt(rating) || 5,
          country,
          reviews: parseInt(reviews) || 0,
        });

        successCount++;
      } catch (error: any) {
        errors.push({ row: index + 2, message: `Row ${index + 2}: ${error.message || 'Unknown error'}` });
      }
    });

    setImportStatus({ success: successCount, errors });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'Product Name',
        brand: 'Brand Name',
        category: 'Category',
        price: '19.99',
        originalPrice: '24.99',
        image: 'https://example.com/image.jpg',
        description: 'Product description',
        stock: '100',
        sku: 'PROD-001',
        rating: '5',
        country: 'USA',
        reviews: '0',
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'product_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Products
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand || '-'}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product information' : 'Add a new product to your catalog'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingProduct ? 'Update' : 'Add'} Product</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteProduct(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Products Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Products from CSV/Excel</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to import multiple products at once
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400" />
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Upload CSV or Excel file
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supported formats: .csv, .xlsx, .xls
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Required Columns:</h4>
              <p className="text-xs text-blue-700 mb-2">
                name, category, price, sku, image, stock
              </p>
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Optional Columns:</h4>
              <p className="text-xs text-blue-700">
                brand, originalPrice, description, rating (default: 5), country (default: USA), reviews (default: 0)
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>

            {importStatus && (
              <div className="space-y-2">
                {importStatus.success > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Successfully imported {importStatus.success} product(s)
                      </p>
                    </div>
                  </div>
                )}

                {importStatus.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <p className="text-sm font-medium text-red-900">
                        {importStatus.errors.length} error(s) found
                      </p>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {importStatus.errors.map((error, idx) => (
                        <p key={idx} className="text-xs text-red-700">
                          {error.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsImportDialogOpen(false);
                  setImportStatus(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

