'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Layers,
  Ruler,
  Shield,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';

interface CustomBrief {
  furnitureType: string;
  woodSpecies: string;
  edgeProfile: string;
  resinOption: string;
  legStyle: string;
  lengthInches: number;
  widthInches: number;
  heightInches: number;
  customerName: string;
  customerCity: string;
  customerNotes: string;
}

export default function CustomStudioPage() {
  const [brief, setBrief] = useState<CustomBrief>({
    furnitureType: 'Dining Table',
    woodSpecies: 'Sheesham (Indian Rosewood)',
    edgeProfile: 'Natural Organic Live Edge',
    resinOption: 'None (Solid Pure Wood)',
    legStyle: 'Matte Black Spider Starburst Base',
    lengthInches: 84,
    widthInches: 38,
    heightInches: 30,
    customerName: '',
    customerCity: '',
    customerNotes: '',
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [preparedUrl, setPreparedUrl] = useState<string | null>(null);

  const furnitureTypes = [
    { name: 'Dining Table', defaultL: 84, defaultW: 38, defaultH: 30, basePrice: 150000 },
    { name: 'Coffee Table', defaultL: 44, defaultW: 24, defaultH: 18, basePrice: 48000 },
    { name: 'Miro-Style Side Table', defaultL: 20, defaultW: 20, defaultH: 22, basePrice: 28500 },
    { name: 'Executive Work Desk', defaultL: 66, defaultW: 30, defaultH: 30, basePrice: 110000 },
    { name: 'Entryway Console', defaultL: 50, defaultW: 14, defaultH: 32, basePrice: 50000 },
    { name: 'Live Edge Bench', defaultL: 60, defaultW: 15, defaultH: 18, basePrice: 38000 },
  ];

  const woodOptions = [
    {
      name: 'Sheesham (Indian Rosewood)',
      description: 'Indigenous dense hardwood with dramatic honey & dark espresso grain contrast.',
      rateMultiplier: 1.0,
    },
    {
      name: 'American Black Walnut',
      description: 'Velvety chocolate hues, purplish undertones, and supreme luxury stability.',
      rateMultiplier: 1.35,
    },
    {
      name: 'White Oak',
      description: 'Light Nordic tones, prominent medullary rays, and extreme hardness.',
      rateMultiplier: 1.15,
    },
    {
      name: 'Golden Teak',
      description: 'Warm honey amber timber, silky touch, and natural weather resilience.',
      rateMultiplier: 1.25,
    },
  ];

  const edgeProfiles = [
    'Natural Organic Live Edge',
    'Straight Square Edge (Modern Minimal)',
    'Reverse Chamfer / Beveled Edge',
  ];

  const resinOptions = [
    { name: 'None (Solid Pure Wood)', surcharge: 0 },
    { name: 'Deep Ocean Blue River', surcharge: 28000 },
    { name: 'Emerald Forest Green River', surcharge: 28000 },
    { name: 'Smoked Obsidian Black River', surcharge: 24000 },
    { name: 'Crystal Clear Water River', surcharge: 25000 },
  ];

  const legOptions = [
    'Matte Black Spider Starburst Base',
    'Matte Black Heavy U-Frames',
    'Trapezoid Architectural Mild Steel',
    'Brushed Brass Metal Legs',
    'Cantilever Heavy Steel Desk Legs',
    'Minimalist Geometric Tubing',
  ];

  // Dynamic estimate calculation based on volume, wood type, and resin
  const calculateEstimate = () => {
    const selectedType =
      furnitureTypes.find((t) => t.name === brief.furnitureType) || furnitureTypes[0];
    const selectedWoodObj =
      woodOptions.find((w) => w.name === brief.woodSpecies) || woodOptions[0];
    const selectedResinObj =
      resinOptions.find((r) => r.name === brief.resinOption) || resinOptions[0];

    const areaRatio =
      (brief.lengthInches * brief.widthInches) / (selectedType.defaultL * selectedType.defaultW);

    const adjustedBase = selectedType.basePrice * Math.max(0.6, areaRatio);
    const withWood = adjustedBase * selectedWoodObj.rateMultiplier;
    const finalPKR = Math.round((withWood + selectedResinObj.surcharge) / 500) * 500;
    const finalUSD = Math.round(finalPKR / 280);

    return { pkr: finalPKR, usd: finalUSD };
  };

  const estimate = calculateEstimate();

  const handleValidateAndPrepare = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!brief.customerName.trim()) {
      errors.push('Please enter your Name.');
    }
    if (!brief.customerCity.trim()) {
      errors.push('Please enter your City (for delivery crating calculations).');
    }
    if (brief.lengthInches <= 0 || brief.widthInches <= 0 || brief.heightInches <= 0) {
      errors.push('Dimensions must be greater than 0 inches.');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setPreparedUrl(null);
      return;
    }

    setValidationErrors([]);

    const text = `*RAWKRAFT STUDIO — CUSTOM COMMISSION BRIEF*

*Customer Details:*
• Name: ${brief.customerName.trim()}
• City: ${brief.customerCity.trim()}

*Piece Specification:*
• Archetype: ${brief.furnitureType}
• Wood Species: ${brief.woodSpecies}
• Edge Contour: ${brief.edgeProfile}
• Epoxy Resin: ${brief.resinOption}
• Base / Leg Style: ${brief.legStyle}
• Custom Dimensions: ${brief.lengthInches}" Length × ${brief.widthInches}" Width × ${brief.heightInches}" Height

*Estimated Range:* PKR ${estimate.pkr.toLocaleString()} (~$${estimate.usd} USD)

${brief.customerNotes.trim() ? `*Additional Notes / Special Request:*\n${brief.customerNotes.trim()}\n\n` : ''}_Hi RawKraft Team! I prepared this custom brief on your studio website. Please let me know slab availability and the next steps._`;

    // Persist custom brief into backend database repository
    fetch('/api/admin/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: brief.customerName.trim(),
        customerCity: brief.customerCity.trim(),
        customerPhone: '+92 331 7497444',
        furnitureType: brief.furnitureType,
        woodSpecies: brief.woodSpecies,
        edgeProfile: brief.edgeProfile,
        resinOption: brief.resinOption,
        legStyle: brief.legStyle,
        lengthInches: brief.lengthInches,
        widthInches: brief.widthInches,
        heightInches: brief.heightInches,
        estimatedPricePKR: estimate.pkr,
        customerNotes: brief.customerNotes.trim(),
      }),
    }).catch((e) => console.warn('Enquiry background save:', e));

    const url = `https://wa.me/923317497444?text=${encodeURIComponent(text)}`;
    setPreparedUrl(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#c89d66]/15 border border-[#c89d66]/30 text-[#c89d66] text-xs font-mono uppercase tracking-widest mb-3">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Interactive Commission Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
          Configure Your Bespoke Masterpiece
        </h1>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Specify your room measurements, chosen timber slab, resin canyon tint, and architectural
          steel base. Once validated, your brief is formatted into a direct WhatsApp message to our
          workshop master craftsmen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form Column */}
        <form onSubmit={handleValidateAndPrepare} className="lg:col-span-8 space-y-8">
          {/* Step 1: Furniture Archetype */}
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#c89d66] text-[#0f1012] font-mono text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-serif text-xl font-bold text-white">Select Furniture Archetype</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {furnitureTypes.map((type) => {
                const isSelected = brief.furnitureType === type.name;
                return (
                  <button
                    key={type.name}
                    type="button"
                    onClick={() =>
                      setBrief((prev) => ({
                        ...prev,
                        furnitureType: type.name,
                        lengthInches: type.defaultL,
                        widthInches: type.defaultW,
                        heightInches: type.defaultH,
                      }))
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#c89d66] bg-[#c89d66]/10 text-white font-medium shadow-md'
                        : 'border-[#2c313a] bg-[#1e2126] text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">{type.name}</div>
                    <div className="text-[10px] text-neutral-400 mt-1 font-mono">
                      Std: {type.defaultL}&quot; × {type.defaultW}&quot;
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Wood Species & Edge Profile */}
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#c89d66] text-[#0f1012] font-mono text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-serif text-xl font-bold text-white">
                Hardwood Species & Edge Contour
              </h2>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                Choose Seasoned Hardwood:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {woodOptions.map((wood) => {
                  const isSelected = brief.woodSpecies === wood.name;
                  return (
                    <div
                      key={wood.name}
                      onClick={() => setBrief((prev) => ({ ...prev, woodSpecies: wood.name }))}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#c89d66] bg-[#c89d66]/10 text-white'
                          : 'border-[#2c313a] bg-[#1e2126] text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>{wood.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#c89d66]" />}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-normal">
                        {wood.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                Edge Profile:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {edgeProfiles.map((edge) => (
                  <button
                    key={edge}
                    type="button"
                    onClick={() => setBrief((prev) => ({ ...prev, edgeProfile: edge }))}
                    className={`p-3 rounded-lg border text-xs text-left transition-all ${
                      brief.edgeProfile === edge
                        ? 'border-[#c89d66] bg-[#c89d66]/10 text-white font-medium'
                        : 'border-[#2c313a] bg-[#1e2126] text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    {edge}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Resin River Inlay */}
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#c89d66] text-[#0f1012] font-mono text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-serif text-xl font-bold text-white">
                Epoxy Resin River & Inlay
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resinOptions.map((resin) => {
                const isSelected = brief.resinOption === resin.name;
                return (
                  <button
                    key={resin.name}
                    type="button"
                    onClick={() => setBrief((prev) => ({ ...prev, resinOption: resin.name }))}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#c89d66] bg-[#c89d66]/10 text-white font-medium'
                        : 'border-[#2c313a] bg-[#1e2126] text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{resin.name}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                        {resin.surcharge > 0
                          ? `+PKR ${resin.surcharge.toLocaleString()} pour & polish`
                          : 'Standard solid timber finish'}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#c89d66] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Base / Steel Leg Style */}
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#c89d66] text-[#0f1012] font-mono text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="font-serif text-xl font-bold text-white">
                Base & Architectural Steel
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {legOptions.map((leg) => {
                const isSelected = brief.legStyle === leg;
                return (
                  <button
                    key={leg}
                    type="button"
                    onClick={() => setBrief((prev) => ({ ...prev, legStyle: leg }))}
                    className={`p-3 rounded-lg border text-xs text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#c89d66] bg-[#c89d66]/10 text-white font-medium'
                        : 'border-[#2c313a] bg-[#1e2126] text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    <span>{leg}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#c89d66]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Dimensions & Customer Details */}
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#c89d66] text-[#0f1012] font-mono text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h2 className="font-serif text-xl font-bold text-white">
                Dimensions & Workshop Contact
              </h2>
            </div>

            {/* Dimension Sliders / Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Length (Inches)
                </label>
                <input
                  type="number"
                  min={12}
                  max={180}
                  value={brief.lengthInches}
                  onChange={(e) =>
                    setBrief((prev) => ({ ...prev, lengthInches: Number(e.target.value) || 0 }))
                  }
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-neutral-500 font-mono">
                  ~{(brief.lengthInches / 12).toFixed(1)} feet
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Width (Inches)
                </label>
                <input
                  type="number"
                  min={10}
                  max={84}
                  value={brief.widthInches}
                  onChange={(e) =>
                    setBrief((prev) => ({ ...prev, widthInches: Number(e.target.value) || 0 }))
                  }
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-neutral-500 font-mono">
                  ~{(brief.widthInches / 12).toFixed(1)} feet
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Height (Inches)
                </label>
                <input
                  type="number"
                  min={12}
                  max={45}
                  value={brief.heightInches}
                  onChange={(e) =>
                    setBrief((prev) => ({ ...prev, heightInches: Number(e.target.value) || 0 }))
                  }
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-neutral-500 font-mono">Standard: 30&quot;</span>
              </div>
            </div>

            {/* Customer Name and City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Khan"
                  value={brief.customerName}
                  onChange={(e) => setBrief((prev) => ({ ...prev, customerName: e.target.value }))}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  City for Crated Delivery *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Islamabad, Lahore, Karachi"
                  value={brief.customerCity}
                  onChange={(e) => setBrief((prev) => ({ ...prev, customerCity: e.target.value }))}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg px-3 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Additional notes / references */}
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Special Requests / Architectural Blueprint Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Mention specific butterfly key inlays, cable grommets, target seating number, or reference image descriptions..."
                value={brief.customerNotes}
                onChange={(e) => setBrief((prev) => ({ ...prev, customerNotes: e.target.value }))}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg p-3 text-xs text-white"
              />
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  <span>Please review the following:</span>
                </div>
                <ul className="list-disc list-inside">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit & Generate Brief Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#c89d66] text-[#0f1012] font-bold text-sm tracking-wider uppercase hover:bg-[#b58952] transition-colors flex items-center justify-center gap-2"
            >
              <span>Validate & Prepare WhatsApp Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Sticky Preview Column */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 space-y-6">
            <div className="border-b border-[#2c313a] pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c89d66]">
                Real-Time Specification
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">Commission Summary</h3>
            </div>

            {/* Estimate Box */}
            <div className="p-4 rounded-xl bg-[#1e2126] border border-[#2c313a]">
              <div className="text-[11px] text-neutral-400 font-mono">Estimated Investment</div>
              <div className="text-3xl font-serif font-bold text-[#c89d66] my-1">
                PKR {estimate.pkr.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-400 font-mono">
                Approx. ${estimate.usd} USD • Standard 3-4 weeks lead
              </div>
            </div>

            {/* Specs Summary List */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#2c313a]/50">
                <span className="text-neutral-400">Archetype:</span>
                <span className="font-medium text-white text-right">{brief.furnitureType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2c313a]/50">
                <span className="text-neutral-400">Hardwood:</span>
                <span className="font-medium text-white text-right">{brief.woodSpecies}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2c313a]/50">
                <span className="text-neutral-400">Edge:</span>
                <span className="font-medium text-white text-right">{brief.edgeProfile}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2c313a]/50">
                <span className="text-neutral-400">Resin Inlay:</span>
                <span className="font-medium text-white text-right">{brief.resinOption}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2c313a]/50">
                <span className="text-neutral-400">Leg Base:</span>
                <span className="font-medium text-white text-right">{brief.legStyle}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2c313a]/50">
                <span className="text-neutral-400">Size:</span>
                <span className="font-medium text-white font-mono text-right">
                  {brief.lengthInches}&quot; × {brief.widthInches}&quot; × {brief.heightInches}&quot;
                </span>
              </div>
            </div>

            {/* Prepared WhatsApp Action */}
            {preparedUrl ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-emerald-950/50 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Brief Validated!</span>
                    <p className="text-[11px] text-emerald-400/90 mt-0.5">
                      Click below to open WhatsApp with your prefilled custom order.
                    </p>
                  </div>
                </div>

                <a
                  href={preparedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Send Brief to Workshop on WhatsApp</span>
                </a>
              </div>
            ) : (
              <div className="text-[11px] text-neutral-400 italic text-center p-3 rounded-lg bg-[#1e2126]/60 border border-[#2c313a]">
                Fill out your details on the left and click &apos;Validate &amp; Prepare WhatsApp Brief&apos; to
                connect directly with our craftsmen.
              </div>
            )}

            <div className="pt-2 text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#c89d66]" />
              <span>Safe wooden crate delivery across Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
