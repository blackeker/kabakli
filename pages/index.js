import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

// Custom hook for fetching menu data
const useMenu = (date) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!date) {
        setLoading(false);
        return;
      }

      // Format date as DD.MM.YYYY for API
      const formattedDate = date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\./g, '.'); // Already in DD.MM.YYYY format for tr-TR

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/menu?date=${formattedDate}`);
        if (!response.ok) {
          throw new Error('Menu not found');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [date]);

  return { data, loading, error };
};

// Skeleton loader component
const MenuItemSkeleton = () => (
  <div className="px-4 py-5 sm:px-6 flex items-start">
    <div className="flex-shrink-0 h-10 w-10">
      <div className="h-full w-full bg-gray-200 rounded-full animate-pulse"></div>
    </div>
    <div className="ml-4 w-0 flex-1 pt-1">
      <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
      <div className="mt-2 h-1.5 bg-gray-200 rounded w-2/3 animate-pulse"></div>
    </div>
  </div>
);

// Menu item component
const MenuItem = ({ text, emoji }) => (
  <li className="px-4 py-5 sm:px-6 flex items-start">
    <div className="flex-shrink-0 h-10 w-10">
      <span className="text-2xl">{emoji || '🍽️'}</span>
    </div>
    <div className="ml-4 w-0 flex-1 pt-1">
      <p className="text-sm font-medium text-gray-900">{text}</p>
    </div>
  </li>
);

// Section component
const MenuSection = ({ title, items, date }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {new Date(date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {items.map((item, index) => (
            <MenuItem key={index} text={item.text} emoji={item.emoji} />
          ))}
        </ul>
      </div>
    </div>
  );
};

// Date picker component
const DatePicker = ({ selectedDate, onDateChange, minDate, maxDate }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const selectDate = (date) => {
    onDateChange(date);
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const days = [];
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Add empty days for the start of the month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDisabled = (day) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return (minDate && date < minDate) || (maxDate && date > maxDate);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Previous month"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {viewDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Next month"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="px-4 pb-5">
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500">
          {/* Days of week header */}
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Pazar'].map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {/* Calendar days */}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-10"></div>;
            }

            const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            const isSelected = selectedDate && isSameDay(selectedDate, date);
            const isToday = isSameDay(new Date(), date);
            const disabled = isDisabled(day);

            return (
              <button
                key={index}
                onClick={() => !disabled && selectDate(date)}
                disabled={disabled}
                className={`h-10 w-full rounded ${isSelected
                  ? 'bg-indigo-600 text-white'
                  : isToday
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'hover:bg-gray-100 text-gray-900'} transition-colors`}
                aria-label={`${date.toLocaleDateString()}${isSelected ? ', selected' : ''}${disabled ? ', disabled' : ''}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notificationPermission, setNotificationPermission] = useState(false);
  const { data, loading, error } = useMenu(
    selectedDate.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '.')
  );

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationPermission(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            setNotificationPermission(true);
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    // Show notification when menu data updates
    if (data && notificationPermission) {
      new Notification('Menü Güncellendi', {
        body: `${data.gun} menüsü güncellendi!`,
        icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
      });
    }
  }, [data, notificationPermission]);

  // Handle error notifications
  useEffect(() => {
    if (error && notificationPermission) {
      new Notification('Menü Hatası', {
        body: 'Menü yüklenirken bir hata oluştu.',
        icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
      });
    }
  }, [error, notificationPermission]);

  // Handle share functionality
  const handleShare = async () => {
    if (!navigator.share || !data) return;

    try {
      await navigator.share({
        title: `Ahmet Kabaklı Menü - ${data.gun}`,
        text: `${data.gun} menüsü:\n\nKahvaltı: ${data.kahvalti?.join(', ') || 'Yok'}\nAkşam Yemeği: ${data.aksam_yemegi?.join(', ') || 'Yok'}`,
        url: window.location.href
      });
    } catch (err) {
      console.error('Paylaşım hatası:', err);
      // Fallback: show alert if share fails
      alert('Menü paylaşılırken bir hata oluştu. Lütfen menüyü kopyalayarak paylaşın.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Ahmet Kakablı menu</title>
          <meta name="description" content="Keklik sunar" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="max-w-xl w-full space-y-6">
          <div className="flex items-center justify-center">
            <div className="h-14 w-14">
              <Image src="/menu-error.png" alt="Error" width={64} height={64} />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Menü Yüklenemedi
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              {error}
            </p>
            <div className="mt-6 flex items-center justify-center space-x-3">
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Bugünün Menüsünü Yenile
              </button>
              <button
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  setSelectedDate(yesterday);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Dün
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Ahmet kabaklı menu</title>
          <meta name="description" content="Ahmet kabaklı menu" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="h-14 w-14">
                <Image src="/menu-loading.png" alt="Loading" width={64} height={64} />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Menü yükleniyor...
            </p>
            {/* Skeleton loaders */}
            <div className="max-w-2xl w-full space-y-4">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Kahvaltı
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Bugün
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="space-y-0">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <MenuItemSkeleton key={index} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Akşam Yemeği
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Bugün
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="space-y-0">
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <MenuItemSkeleton key={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Ahmet kabaklı menu</title>
          <meta name="description" content="Ahmet kabaklı menu" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="h-14 w-14">
                <Image src="/menu-loading.png" alt="Loading" width={64} height={64} />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Menü bulunamadı. Lütfen başka bir tarih seçiniz.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Ahmet kabaklı menu</title>
        <meta name="description" content="Ahmet kabaklı menu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Ahmet kabaklı menu
            </h1>
            <p className="text-lg text-gray-600">
              Günlük lezzetler, sağlıklı ve lezzetli menüler
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-label="Menüyü paylaş"
              disabled={!navigator.share || !data}
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6H4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M8 6V4m0 0h4m-4 0a4.97 4.97 0 00-2.76 1.41A5.93 5.93 0 0112.04 9a5.93 5.93 0 014.04-2.59A4.97 4.97 0 0016 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.293.707V20a2 2 0 01-2 2h-6a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Quick date navigation */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              const yesterday = new Date(selectedDate);
              yesterday.setDate(yesterday.getDate() - 1);
              setSelectedDate(yesterday);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Dün
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Bugün
          </button>
          <button
            onClick={() => {
              const tomorrow = new Date(selectedDate);
              tomorrow.setDate(tomorrow.getDate() + 1);
              setSelectedDate(tomorrow);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Yarın
          </button>
        </div>

        {/* Main content */}
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          {/* Date picker sidebar */}
          <aside className="sticky top-16">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              minDate={new Date('2023-01-01')}
              maxDate={new Date()}
            />
          </aside>

          {/* Menu display */}
          <main>
            {data.kahvalti && data.kahvalti.length > 0 && (
              <MenuSection
                title="Kahvaltı"
                items={data.kahvalti}
                date={data.tarih}
              />
            )}
            {data.aksam_yemegi && data.aksam_yemegi.length > 0 && (
              <MenuSection
                title="Akşam Yemeği"
                items={data.aksam_yemegi}
                date={data.tarih}
              />
            )}
            {!data.kahvalti && !data.aksam_yemegi && (
              <div className="bg-white rounded-lg shadow py-12 text-center">
                <p className="text-gray-500">
                  Bu tarih için menü bilgisi bulunamadı.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}