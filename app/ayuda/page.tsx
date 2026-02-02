// pages/ayuda.tsx
export default function Ayuda() {
  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      <div className="max-w-4xl mx-auto p-8 space-y-12 text-[#2E2E2E]">

        {/* Título */}
        <section>
          <h1 className="text-3xl font-semibold mb-4">
            Ayuda y uso del perfil memorial
          </h1>
          <p className="text-lg text-[#2E2E2E]/80">
            Este espacio fue creado para acompañarte en la administración del
            perfil memorial, de forma simple, segura y respetuosa.
          </p>
        </section>

        {/* Qué incluye */}
        <section className="bg-white/60 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-[#C48B9F]">
            ¿Qué incluye tu perfil memorial?
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Un perfil digital personalizado en memoria de una persona fallecida.</li>
            <li>Un código QR único para acceder públicamente al perfil.</li>
            <li>Usuario y contraseña para administrar el contenido.</li>
            <li>Acceso a un panel privado de edición.</li>
          </ul>
        </section>

        {/* Acceso */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Acceso con usuario y contraseña
          </h2>
          <p>
            Al contratar el servicio recibirás credenciales personales. Desde el
            apartado <strong className="text-[#C48B9F]"> Iniciar sesión </strong>
             podrás acceder al panel de administración.
          </p>
          <p className="mt-2">
            Solo quienes tengan estas credenciales pueden editar el perfil.
            El código QR es únicamente para visualización.
          </p>
        </section>

        {/* QR */}
        <section className="border-l-4 pl-4 border-[#C2A46D]">
          <h2 className="text-2xl font-semibold mb-3">
            ¿Cómo funciona el código QR?
          </h2>
          <p>
            El código QR permite que familiares y seres queridos accedan al perfil
            memorial de forma rápida y sencilla.
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>No requiere iniciar sesión.</li>
            <li>No permite editar información.</li>
            <li>Puede colocarse en espacios conmemorativos.</li>
          </ul>
        </section>

        {/* Administración */}
        <section className="bg-white/60 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-[#C48B9F]">
            Administración del perfil
          </h2>
          <p>Desde tu panel privado puedes:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Editar la biografía y la información principal.</li>
            <li>Subir, modificar o eliminar fotografías.</li>
            <li>Subir o eliminar videos según tu plan.</li>
            <li>Subir, eliminar o editar comentarios.</li>
          </ul>
        </section>

        {/* Límites */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Límites de contenido
          </h2>
          <p>
            El perfil cuenta con un límite de almacenamiento según el plan
            contratado. Una vez alcanzado, deberás liberar espacio para subir
            nuevos archivos. 
          </p>
        </section>

        {/* Problemas */}
        <section className="bg-white/60 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-[#C48B9F]">
            Problemas frecuentes
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Si olvidaste tu contraseña, contáctanos para recuperarla.</li>
            <li>Si el QR no abre, prueba con otro lector o dispositivo.</li>
            <li>Si no puedes subir archivos, revisa el límite disponible.</li>
          </ul>
        </section>

        {/* Contacto */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Soporte y contacto
          </h2>
          <p>
            Si necesitas ayuda adicional, estamos aquí para acompañarte.
          </p>
          <p className="mt-2 font-medium text-[#C2A46D]">
            carranzapacheco.f.a@gmail.com
          </p>
          <p className="mt-2 font-medium">
           De igual manera puedes contactarme a mi WhatsApp dando click al ícono verde que te aparece en la parte infierior de la derecha          </p>
        </section>

        {/* Cierre */}
        <section className="border-t pt-3">
          <p className="italic text-[#2E2E2E]/70">
            Este perfil es un espacio de memoria, amor y respeto.
            Gracias por cuidarlo.
          </p>
        </section>

      </div>
    </div>
  );
}
