import { useMemo, useState } from 'react';
import { Eye, EyeOff, KeyRound, Mail, Phone, Sparkles, UserRound } from 'lucide-react';

const iconByField = {
  email: Mail,
  password: KeyRound,
  phone: Phone,
  fullName: UserRound,
};

export default function AuthForm({ title, subtitle, submitLabel, fields, onSubmit, footer }) {
  const initial = useMemo(() => Object.fromEntries(fields.map((field) => [field.name, ''])), [fields]);
  const [values, setValues] = useState(initial);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await onSubmit(values);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell section">
      <div className="container auth-container">
        <form className="card auth-card auth-card-enhanced" onSubmit={submit}>
          <div className="auth-topbar">
            <span className="auth-badge">
              <Sparkles size={15} />
              Beauty Glow
            </span>
          </div>

          <div className="auth-heading">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="form-grid one-col auth-grid">
            {fields.map((field) => {
              const Icon = iconByField[field.name] || UserRound;
              const isPassword = field.type === 'password';

              return (
                <label key={field.name} className="field auth-field">
                  <span>{field.label}</span>
                  <div className="input-shell">
                    <span className="input-icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <input
                      type={isPassword && showPassword ? 'text' : field.type}
                      name={field.name}
                      value={values[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required !== false}
                    />
                    {isPassword ? (
                      <button
                        type="button"
                        className="icon-btn password-toggle"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    ) : null}
                  </div>
                </label>
              );
            })}
          </div>

          {error ? <p className="error-text auth-error">{error}</p> : null}

          <div className="form-submit-space auth-submit-wrap">
            <button className="btn btn-primary full auth-submit-btn" disabled={loading}>
              {loading ? 'Chargement...' : submitLabel}
            </button>
          </div>

          {footer ? <div className="auth-footer-slot auth-footer-enhanced">{footer}</div> : null}
        </form>
      </div>
    </section>
  );
}
