"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PrivacyPage() {
  const router = useRouter()

  useEffect(() => {
    // Устанавливаем правильный заголовок для мета-тегов
    document.title = "Политика конфиденциальности - РЕЦЕПТОР"
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Кнопка назад */}
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Назад
        </button>

        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Политика конфиденциальности
          </h1>
          <p className="text-muted-foreground">
            Дата последнего обновления: 14 марта 2026 года
          </p>
        </div>

        {/* Основной контент */}
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Общие положения</h2>
            <p className="text-muted-foreground leading-relaxed">
              Приложение РЕЦЕПТОР уважает вашу конфиденциальность и обязуется защищать персональные данные,
              которые вы предоставляете при использовании нашего мобильного приложения. Эта политика
              конфиденциальности описывает, какие данные мы собираем, как мы их используем и защищаем.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Собираемые данные</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">2.1. Фотографии холодильника</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Мы запрашиваем доступ к камере вашего устройства исключительно для фотографирования
                  содержимого холодильника. Фотографии используются для распознавания продуктов с помощью
                  искусственного интеллекта и подбора соответствующих рецептов.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">2.2. Данные профиля</h3>
                <p className="text-muted-foreground leading-relaxed">
                  При желании вы можете создать профиль, указав предпочтения в питании, диетические
                  ограничения и кулинарные цели. Эти данные хранятся локально на вашем устройстве.
                </p>
                           </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">2.3. Избранные рецепты</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Рецепты, которые вы добавляете в избранное, сохраняются локально на вашем устройстве
                  для быстрого доступа.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Использование данных</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">3.1. AI обработка фотографий</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Фотографии холодильника отправляются на наш сервер для анализа с помощью
                  искусственного интеллекта. AI распознает продукты на фотографии и возвращает список
                  ингредиентов для подбора рецептов.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">3.2. Хранение фотографий</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Фотографии не хранятся на наших серверах постоянно. Они удаляются немедленно
                  после получения результата анализа AI. Мы не создаем базу данных фотографий
                  пользователей.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">3.3. Персонализация</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Данные профиля используются для персонализации рекомендаций рецептов с учетом ваших
                  предпочтений и диетических ограничений.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Защита данных</h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы используем современные методы защиты данных для обеспечения безопасности вашей
              информации. Все передачи данных шифруются с помощью протокола HTTPS. Доступ к
              серверам ограничен и регулярно аудируется.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Третьи лица</h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы не передаем ваши персональные данные третьим лицам для маркетинговых целей.
              Мы используем сервисы OpenAI для обработки фотографий с AI в соответствии с их
              политикой конфиденциальности.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Права пользователя</h2>
            <p className="text-muted-foreground leading-relaxed">
              Вы имеете право на доступ, изменение и удаление своих персональных данных.
              Поскольку большинство данных хранится локально на вашем устройстве, вы можете
              управлять ими через настройки приложения.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Дети</h2>
            <p className="text-muted-foreground leading-relaxed">
              Наше приложение не предназначено для детей младше 13 лет. Мы не собираем
              персональные данные детей сознательно.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Изменения в политике</h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы можем обновлять эту политику конфиденциальности время от времени. О существенных
              изменениях мы будем уведомлять пользователей через приложение.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Контакты</h2>
            <p className="text-muted-foreground leading-relaxed">
              Если у вас есть вопросы о политике конфиденциальности или обработке ваших данных,
              пожалуйста, свяжитесь с нами:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-foreground">Веб-сайт: receptor-app-beta.vercel.app</p>
              <p className="text-foreground">Email: privacy@receptor.app</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Юридическая информация</h2>
            <p className="text-muted-foreground leading-relaxed">
              Эта политика конфиденциальности регулируется законодательством Российской Федерации.
              Используя приложение РЕЦЕПТОР, вы соглашаетесь с условиями этой политики.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}