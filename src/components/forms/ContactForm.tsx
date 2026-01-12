import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Créer le contenu du mail
    const subject = formData.service
      ? `Demande de devis - ${formData.service}`
      : 'Demande de contact';

    const body = `
Nom: ${formData.name}
Email: ${formData.email}
Téléphone: ${formData.phone}
${formData.service ? `Service: ${formData.service}` : ''}

Message:
${formData.message}
    `.trim();

    // Créer le lien mailto
    const mailtoLink = `mailto:contact@rp-locationdebenne37.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Ouvrir le client email
    window.location.href = mailtoLink;

    // Afficher le message de confirmation
    setSubmitted(true);

    // Réinitialiser le formulaire
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
        <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
          Merci pour votre message !
        </h3>
        <p className="text-neutral-600 mb-6">
          Votre client email s'est ouvert avec votre message pré-rempli. Envoyez-le pour que nous puissions vous répondre rapidement.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nom complet"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Jean Dupont"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="jean.dupont@exemple.fr"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Téléphone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
          placeholder="06 31 46 43 50"
        />

        <div className="w-full">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Service souhaité
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-300 focus:border-primary-500 focus:outline-none transition-colors duration-200"
          >
            <option value="">Sélectionnez un service</option>
            <option value="Benne 10m³">Benne 10m³</option>
            <option value="Benne 15m³">Benne 15m³</option>
            <option value="Benne 20m³">Benne 20m³</option>
            <option value="Benne 30m³">Benne 30m³</option>
            <option value="Benne gravats">Benne gravats</option>
            <option value="Benne tout-venant">Benne tout-venant</option>
            <option value="Benne bois">Benne bois</option>
          </select>
        </div>
      </div>

      <Textarea
        label="Votre message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        required
        rows={6}
        placeholder="Décrivez votre projet, la date souhaitée, l'adresse de livraison..."
      />

      {/* Honeypot anti-spam */}
      <input
        type="text"
        name="honeypot"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <button
        type="submit"
        className="w-full px-8 py-4 bg-primary-600 text-white font-semibold text-lg rounded-lg hover:bg-primary-700 transition-all duration-200 hover:shadow-strong hover:-translate-y-0.5"
      >
        Envoyer la demande
      </button>

      <p className="text-sm text-neutral-500 text-center">
        En soumettant ce formulaire, votre client email s'ouvrira avec votre message pré-rempli.
      </p>
    </form>
  );
}
