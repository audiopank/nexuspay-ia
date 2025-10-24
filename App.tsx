import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Affiliates from './components/Affiliates';
import Products from './components/Products';
import Integrations from './components/Integrations';
import Webhooks from './components/Webhooks';
import Developers from './components/Developers';
import Settings from './components/Settings';
import Reports from './components/Reports';
import Subscriptions from './components/Subscriptions';
import AffiliatePortal from './components/AffiliatePortal';
import PaymentLinks from './components/PaymentLinks';
import Placeholder from './components/Placeholder';
import OnboardingAgent from './components/OnboardingAgent';
import NexusAgent from './components/NexusAgent';
import IntegrationAgent from './components/IntegrationAgent';
import FloatingButtons from './components/FloatingButtons';

import { MENU_ITEMS, USER_DATA, NOTIFICATIONS_DATA, PRODUCTS as INITIAL_PRODUCTS, INTEGRATIONS as INITIAL_INTEGRATIONS, PAYMENT_LINKS as INITIAL_PAYMENT_LINKS } from './constants';
import type { MenuId, Notification, Product, Integration, PaymentLink } from './types';


const App: React.FC = () => {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [isNexusAgentOpen, setNexusAgentOpen] = useState(false);
  const [isIntegrationAgentOpen, setIntegrationAgentOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuId>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_DATA);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string | undefined>(undefined);

  // Lifted state for dynamic data
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(INITIAL_PAYMENT_LINKS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [activeMenu]);
  
  const finishOnboarding = () => {
      setIsOnboarding(false);
  };
  
  const handleGlobalSearch = (term: string) => {
    setGlobalSearchTerm(term);
    setActiveMenu('transactions');
  };

  const handleSidebarSelect = (menuId: MenuId) => {
    setGlobalSearchTerm(undefined); // Clear search on sidebar navigation
    setActiveMenu(menuId);
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
      const newProduct: Product = {
          ...productData,
          id: (Math.max(0, ...products.map(p => p.id)) || 0) + 1,
      };
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
  };

  const connectIntegration = (integrationId: string): Integration | null => {
      let connectedIntegration: Integration | null = null;
      setIntegrations(prev => prev.map(int => {
          if (int.id === integrationId) {
              connectedIntegration = { ...int, connected: true };
              return connectedIntegration;
          }
          return int;
      }));
      return connectedIntegration;
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard showBalances={showBalances} setShowBalances={setShowBalances} setActiveMenu={setActiveMenu} />;
      case 'transactions':
        return <Transactions showBalances={showBalances} initialFilter={globalSearchTerm} />;
      case 'products':
        return <Products products={products} setProducts={setProducts} />;
      case 'payment-links':
        return <PaymentLinks paymentLinks={paymentLinks} setPaymentLinks={setPaymentLinks} products={products} />;
      case 'affiliates':
        return <Affiliates showBalances={showBalances} />;
      case 'affiliate-portal':
        return <AffiliatePortal showBalances={showBalances} products={products} />;
      case 'integrations':
        return <Integrations integrations={integrations} setIntegrations={setIntegrations} onOpenAgent={() => setIntegrationAgentOpen(true)} />;
      case 'webhooks':
        return <Webhooks />;
      case 'developers':
        return <Developers />;
      case 'settings':
        return <Settings />;
      case 'reports':
        return <Reports />;
      case 'subscriptions':
        return <Subscriptions />;
      default:
        return <Placeholder setActiveMenu={setActiveMenu} />;
    }
  };
  
  if (isOnboarding) {
    return (
        <OnboardingAgent
            finishOnboarding={finishOnboarding}
            addProduct={addProduct}
            connectIntegration={connectIntegration}
        />
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        user={USER_DATA}
        isNotificationsOpen={isNotificationsOpen}
        setNotificationsOpen={setNotificationsOpen}
        notifications={notifications}
        unreadCount={unreadCount}
        handleMarkAsRead={handleMarkAsRead}
        handleMarkAllAsRead={handleMarkAllAsRead}
        onGlobalSearch={handleGlobalSearch}
      />
      <div className="flex absolute top-[89px] bottom-0 w-full">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={handleSidebarSelect}
          menuItems={MENU_ITEMS}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <FloatingButtons onAgentClick={() => setNexusAgentOpen(true)} />
      <NexusAgent
        isOpen={isNexusAgentOpen}
        onClose={() => setNexusAgentOpen(false)}
        addProduct={addProduct}
      />
      <IntegrationAgent
        isOpen={isIntegrationAgentOpen}
        onClose={() => setIntegrationAgentOpen(false)}
      />
    </div>
  );
};

export default App;