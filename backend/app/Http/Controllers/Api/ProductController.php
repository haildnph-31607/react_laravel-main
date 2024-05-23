<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();
        $variations = [];
        foreach ($products as $product) {
            foreach ($product->variations as $variation) {
                array_push($variations, $variation);
            }
        }
        $data = $products;
        return response()->json($data);
    }
    public function moi()
    {
        $products = Product::where('status', 'new')->get();
        $variations = [];
        foreach ($products as $product) {
            foreach ($product->variations as $variation) {
                array_push($variations, $variation);
            }
        }
        $data = $products;
        return response()->json($data);
    }

    public function banChay()
    {
        $products = Product::join('product_variations', 'products.id', '=', 'product_variations.product_id')
        ->select('products.*', DB::raw('SUM(product_variations.quantity_sold) as total_sold'))
        ->groupBy('products.id', 'products.name', 'products.slug', 'products.seo_keywords', 'products.product_type', 'products.description', 'products.show_hide', 'products.status', 'products.categories_product_id', 'products.brand_id', 'products.created_at', 'products.updated_at')
        ->orderBy('total_sold', 'DESC')
        ->get();

        $variations = [];
        foreach ($products as $product) {
            foreach ($product->variations as $variation) {
                array_push($variations, $variation);
            }
        }

        $data = $products;
        return response()->json($data);
    }

    public function hot()
    {
        $products = Product::where('status', 'hot')->get();
        $variations = [];
        foreach ($products as $product) {
            foreach ($product->variations as $variation) {
                array_push($variations, $variation);
            }
        }
        $data = $products;
        return response()->json($data);
    }
    public function getDetail($id)
    {
        $product = Product::with('category')->find($id);

        $variations = [];

            foreach ($product->variations as $variation) {
                array_push($variations, $variation);
            }

        $data = $product;
        return response()->json($data);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
