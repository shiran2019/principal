import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Skltn from './Skltn'
import TlntGrd from './Talntcard';

function StdRegful() {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'Skltn':
        return <Skltn />;
      case 'TlntGrd':
        return <TlntGrd />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ButtonGroup aria-label="Basic example">
        <Button
          variant="secondary"
          onClick={() => handleComponentChange('Skltn')}
        >
          Student details
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleComponentChange('TlntGrd')}
        >
          Parent details
        </Button>
      </ButtonGroup>
      {renderActiveComponent()}
    </div>
  );
}

export default StdRegful;
