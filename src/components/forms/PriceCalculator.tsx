import { useState, useEffect } from 'react';

// Import des données (on les passe en props depuis Astro)
interface Service {
  id: string;
  name: string;
  volume: string;
  price: number;
}

interface Zone {
  id: string;
  name: string;
  deliveryFee: number;
}

interface Props {
  services: Service[];
  zones: Zone[];
}

export default function PriceCalculator({ services, zones }: Props) {
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [duration, setDuration] = useState<number>(7);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (selectedService && selectedZone) {
      const service = services.find(s => s.id === selectedService);
      const zone = zones.find(z => z.id === selectedZone);

      if (service && zone) {
        // Prix de base pour 7 jours
        let basePrice = service.price;

        // Frais de livraison
        const deliveryFee = zone.deliveryFee;

        // Jours supplémentaires (40€ par jour au-delà de 7 jours)
        const extraDays = Math.max(0, duration - 7);
        const extraDaysFee = extraDays * 40;

        // Total
        const calculatedTotal = basePrice + deliveryFee + extraDaysFee;
        setTotal(calculatedTotal);
      }
    } else {
      setTotal(0);
    }
  }, [selectedService, selectedZone, duration, services, zones]);

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedZoneData = zones.find(z => z.id === selectedZone);

  return (
    <div className="bg-white rounded-xl shadow-medium p-8">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6">
        Calculateur de devis
      </h3>

      <div className="space-y-6">
        {/* Sélection du service */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Type de benne <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-300 focus:border-primary-500 focus:outline-none transition-colors"
          >
            <option value="">Sélectionnez une benne</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price}€ TTC/semaine
              </option>
            ))}
          </select>
        </div>

        {/* Sélection de la zone */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Zone de livraison <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-300 focus:border-primary-500 focus:outline-none transition-colors"
          >
            <option value="">Sélectionnez votre commune</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} {zone.deliveryFee > 0 ? `(+${zone.deliveryFee}€)` : '(gratuit)'}
              </option>
            ))}
          </select>
        </div>

        {/* Durée de location */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Durée de location (jours)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 7)}
            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-300 focus:border-primary-500 focus:outline-none transition-colors"
          />
          <p className="mt-1 text-sm text-neutral-500">
            Base 7 jours inclus. 40€/jour supplémentaire au-delà.
          </p>
        </div>

        {/* Détails du calcul */}
        {total > 0 && (
          <div className="border-t-2 border-neutral-200 pt-6 space-y-3">
            <div className="flex justify-between text-neutral-600">
              <span>{selectedServiceData?.name} ({duration <= 7 ? '7 jours' : `${duration} jours`})</span>
              <span className="font-semibold">
                {selectedServiceData?.price}€
                {duration > 7 && ` + ${(duration - 7) * 40}€`}
              </span>
            </div>

            {selectedZoneData && selectedZoneData.deliveryFee > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Frais de livraison ({selectedZoneData.name})</span>
                <span className="font-semibold">{selectedZoneData.deliveryFee}€</span>
              </div>
            )}

            <div className="flex justify-between items-center text-2xl font-bold text-primary-600 pt-3 border-t-2 border-neutral-200">
              <span>Total TTC</span>
              <span>{total}€</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="pt-4">
          {total > 0 ? (
            <a
              href={`/contact?service=${encodeURIComponent(selectedServiceData?.name || '')}&zone=${encodeURIComponent(selectedZoneData?.name || '')}&duration=${duration}`}
              className="block w-full text-center px-8 py-4 bg-primary-600 text-white font-semibold text-lg rounded-lg hover:bg-primary-700 transition-all duration-200 hover:shadow-strong hover:-translate-y-0.5"
            >
              Demander ce devis
            </a>
          ) : (
            <div className="text-center py-4 text-neutral-500">
              Sélectionnez un service et une zone pour calculer votre devis
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <p className="text-sm text-neutral-600">
          <strong>Note :</strong> Ce tarif est indicatif. Le prix final peut varier selon la nature des déchets et le poids total. Contactez-nous pour un devis personnalisé.
        </p>
      </div>
    </div>
  );
}
