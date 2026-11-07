import React from 'react';
import { useContent } from '../content';

const Privacy = () => {
  const { settings } = useContent();
  return (
    <main className="pt-32">
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto space-y-6 text-charcoal font-light leading-relaxed">
          <h1 className="text-4xl md:text-5xl text-navy mb-8">Политика за поверителност</h1>
          <p>Администратор на личните данни е <strong>Даринеро ООД</strong>, {settings.address || 'ул. Котовск 12, Русе'}, имейл: <a className="text-copper" href={`mailto:${settings.email}`}>{settings.email}</a>.</p>
          <h2 className="text-2xl font-serif text-navy pt-4">Какви данни събираме</h2>
          <p>Когато изтеглите каталог или изпратите запитване, събираме името, фирмата, служебния имейл и (по желание) телефона ви, както и информацията, която попълните във формата – повод, брой подаръци, бюджет, дата за доставка и съобщение.</p>
          <h2 className="text-2xl font-serif text-navy pt-4">За какво ги използваме</h2>
          <p>Използваме данните, за да ви изпратим каталога, да отговорим на запитването ви и да подготвим оферта. Ако отметнете съгласие, ще ви изпращаме и предложения и нови каталози по имейл чрез услугата Mailchimp. Можете да се отпишете по всяко време чрез линка във всеки имейл.</p>
          <h2 className="text-2xl font-serif text-navy pt-4">Колко дълго ги пазим</h2>
          <p>Пазим данните от запитванията толкова, колкото е нужно за обработката им и за съхранение на кореспонденцията с клиенти. Данните за имейл бюлетина пазим до отписването ви.</p>
          <h2 className="text-2xl font-serif text-navy pt-4">Вашите права</h2>
          <p>Имате право на достъп, корекция и изтриване на данните си, както и да оттеглите съгласието си. Пишете ни на <a className="text-copper" href={`mailto:${settings.email}`}>{settings.email}</a>. Имате право и на жалба до Комисията за защита на личните данни.</p>
          <h2 className="text-2xl font-serif text-navy pt-4">Бисквитки</h2>
          <p>Сайтът използва само технически необходимото локално хранилище на браузъра – например за да помни, че вече сте попълнили формата за каталог, и от коя кампания сте дошли.</p>
        </div>
      </section>
    </main>
  );
};

export default Privacy;
