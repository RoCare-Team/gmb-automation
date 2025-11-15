"use client";
import { useState } from "react";
import { Upload, ImageIcon, Palette, Layout, Sparkles, Type, Grid3x3, Move, ZoomIn, RotateCw } from "lucide-react";

export default function AssetsManagement() {
  const [backgroundColor, setBackgroundColor] = useState("#1e293b");
  const [colorPalette, setColorPalette] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [textOverlay, setTextOverlay] = useState("");
  const [productPreview, setProductPreview] = useState(null);
  const [overlayPreview, setOverlayPreview] = useState(null);
  
  // Position and transform states
  const [productPosition, setProductPosition] = useState({ x: 50, y: 50 });
  const [productScale, setProductScale] = useState(100);
  const [productRotation, setProductRotation] = useState(0);
  
  const [overlayPosition, setOverlayPosition] = useState({ x: 80, y: 20 });
  const [overlayScale, setOverlayScale] = useState(100);
  const [overlayRotation, setOverlayRotation] = useState(0);
  
  const [textPosition, setTextPosition] = useState({ x: 50, y: 80 });
  const [textSize, setTextSize] = useState(36);
  const [textColor, setTextColor] = useState("#ffffff");

  const handleImageUpload = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setter(url);
      if (previewSetter) previewSetter(url);
    }
  };

  const predefinedBackgrounds = [
    "#1e293b", "#7c3aed", "#dc2626", "#059669", "#d97706", 
    "#0891b2", "#db2777", "#4f46e5", "#000000", "#ffffff"
  ];

  const colorPalettes = [
    { id: 1, name: "Sunset", colors: ["#FF6B6B", "#FFD93D", "#6BCB77"] },
    { id: 2, name: "Ocean", colors: ["#4D96FF", "#6BCB77", "#FFD93D"] },
    { id: 3, name: "Purple Dreams", colors: ["#9D84B7", "#C996CC", "#E8B4BC"] },
    { id: 4, name: "Neon", colors: ["#00FFF5", "#FF00FF", "#FFFF00"] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            
            {/* Background Color Picker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Color Palette</h2>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-all cursor-pointer">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Custom Color</p>
                    <p className="text-xs text-gray-500 font-mono">{backgroundColor}</p>
                  </div>
                </label>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-3">Quick Colors</p>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedBackgrounds.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className={`w-full aspect-square rounded-lg transition-all duration-300 ${
                        backgroundColor === color
                          ? "ring-4 ring-blue-500 ring-offset-2 scale-110"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {backgroundColor === color && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className={`w-3 h-3 rounded-full ${color === '#ffffff' || color === '#d97706' ? 'bg-gray-800' : 'bg-white'}`} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Palette Selector */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Color Palette</h2>
              </div>
              
              <div className="space-y-3">
                {colorPalettes.map((palette) => (
                  <div
                    key={palette.id}
                    onClick={() => setColorPalette(palette.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      colorPalette === palette.id
                        ? "ring-4 ring-blue-500 bg-blue-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">{palette.name}</p>
                    <div className="flex gap-2">
                      {palette.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex-1 h-8 rounded-lg"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Product Image Upload & Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Product Image</h3>
              </div>
              
              <label className="relative block cursor-pointer group mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-300 group-hover:bg-blue-50">
                  {productPreview ? (
                    <img src={productPreview} alt="preview" className="max-h-32 mx-auto rounded-lg object-contain" />
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 mx-auto text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <p className="text-sm font-medium text-gray-700">Upload Product</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, setProductImage, setProductPreview)}
                  className="hidden"
                  accept="image/*"
                />
              </label>

              {productPreview && (
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Move className="w-4 h-4" /> Position X: {productPosition.x}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={productPosition.x}
                      onChange={(e) => setProductPosition({...productPosition, x: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Move className="w-4 h-4" /> Position Y: {productPosition.y}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={productPosition.y}
                      onChange={(e) => setProductPosition({...productPosition, y: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <ZoomIn className="w-4 h-4" /> Scale: {productScale}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={productScale}
                      onChange={(e) => setProductScale(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <RotateCw className="w-4 h-4" /> Rotation: {productRotation}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={productRotation}
                      onChange={(e) => setProductRotation(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setProductImage(null);
                      setProductPreview(null);
                    }}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Overlay Image & Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                  <Grid3x3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Other Image</h3>
              </div>
              
              <label className="relative block cursor-pointer group mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-all duration-300 group-hover:bg-green-50">
                  {overlayPreview ? (
                    <img src={overlayPreview} alt="overlay" className="max-h-32 mx-auto rounded-lg object-contain" />
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 mx-auto text-gray-400 group-hover:text-green-500 transition-colors" />
                      <p className="text-sm font-medium text-gray-700">Add Decoration</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, setOverlayImage, setOverlayPreview)}
                  className="hidden"
                  accept="image/*"
                />
              </label>

              {overlayPreview && (
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Move className="w-4 h-4" /> Position X: {overlayPosition.x}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={overlayPosition.x}
                      onChange={(e) => setOverlayPosition({...overlayPosition, x: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Move className="w-4 h-4" /> Position Y: {overlayPosition.y}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={overlayPosition.y}
                      onChange={(e) => setOverlayPosition({...overlayPosition, y: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <ZoomIn className="w-4 h-4" /> Scale: {overlayScale}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={overlayScale}
                      onChange={(e) => setOverlayScale(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <RotateCw className="w-4 h-4" /> Rotation: {overlayRotation}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={overlayRotation}
                      onChange={(e) => setOverlayRotation(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setOverlayImage(null);
                      setOverlayPreview(null);
                    }}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Text Overlay & Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                  <Type className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Text Overlay</h3>
              </div>
              
              <input
                type="text"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                placeholder="Enter text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-all mb-4"
              />

              {textOverlay && (
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Move className="w-4 h-4" /> Position X: {textPosition.x}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={textPosition.x}
                      onChange={(e) => setTextPosition({...textPosition, x: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Move className="w-4 h-4" /> Position Y: {textPosition.y}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={textPosition.y}
                      onChange={(e) => setTextPosition({...textPosition, y: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Type className="w-4 h-4" /> Font Size: {textSize}px
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="120"
                      value={textSize}
                      onChange={(e) => setTextSize(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-32">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Real-time</span>
                </div>
              </div>

              <div 
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner transition-all duration-500"
                style={{ backgroundColor }}
              >
                {/* Color Palette Accent */}
                {colorPalette && (
                  <div className="absolute inset-0 opacity-20">
                    {colorPalettes.find(p => p.id === colorPalette)?.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="absolute w-32 h-32 rounded-full blur-3xl"
                        style={{
                          backgroundColor: color,
                          top: `${20 + idx * 30}%`,
                          left: `${10 + idx * 25}%`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Product Image */}
                {/* {productImage && (
                  <div 
                    className="absolute transition-all duration-300"
                    style={{
                      left: `${productPosition.x}%`,
                      top: `${productPosition.y}%`,
                      transform: `translate(-50%, -50%) scale(${productScale / 100}) rotate(${productRotation}deg)`,
                    }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20" />
                      <img
                        src={productImage}
                        alt="product"
                        className="relative max-w-[300px] max-h-[300px] object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>
                )} */}

                {/* Overlay Image */}
                {overlayImage && (
                  <div 
                    className="absolute transition-all duration-300"
                    style={{
                      left: `${overlayPosition.x}%`,
                      top: `${overlayPosition.y}%`,
                      transform: `translate(-50%, -50%) scale(${overlayScale / 100}) rotate(${overlayRotation}deg)`,
                    }}
                  >
                    <img
                      src={overlayImage}
                      alt="overlay"
                      className="max-w-[200px] max-h-[200px] object-contain drop-shadow-xl"
                    />
                  </div>
                )}

                {/* Text Overlay */}
                {textOverlay && (
                  <div 
                    className="absolute transition-all duration-300"
                    style={{
                      left: `${textPosition.x}%`,
                      top: `${textPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <h2 
                      className="font-bold drop-shadow-2xl text-center px-8 whitespace-nowrap"
                      style={{
                        fontSize: `${textSize}px`,
                        color: textColor
                      }}
                    >
                      {textOverlay}
                    </h2>
                  </div>
                )}

                {/* Empty State */}
                {/* {!productImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <ImageIcon className="w-8 h-8 text-white opacity-60" />
                      </div>
                      <p className="text-white font-medium opacity-80">Upload a product image</p>
                      <p className="text-sm text-white opacity-60">Your composition will appear here</p>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}