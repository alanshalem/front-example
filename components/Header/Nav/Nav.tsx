import { IconSvg } from '@brick/core';
import React, { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown/Dropdown';
import {
  SArrowContainer,
  SNav,
  SNavLabel,
  SNavLabelContainer,
  SNavLink,
  SNavLinkContainer,
} from './Nav.styles';

const Nav = ({ navLinks, menuToggleHandler }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = event => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [navRef]);

  const openDropdownHandler = label => {
    if (label === openDropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(label);
    }
  };

  const toggleDropdown = label => {
    setOpenDropdown(prevOpen => (prevOpen === label ? null : label));
  };

  const onSelectCallback = () => {
    if (menuToggleHandler) {
      menuToggleHandler();
    }
    setOpenDropdown(null);
  };

  return (
    <SNav ref={navRef}>
      {navLinks.map(({ label, link, tree }, index) => {
        const isOpen = openDropdown === label;
        return (
          <SNavLinkContainer key={index}>
            {link && (
              <>
                <span
                  style={{
                    borderLeft: '1px solid lightgray',
                    marginRight: '5px',
                  }}
                ></span>
                <SNavLink to={link}>{label}</SNavLink>
              </>
            )}
            {!link && (
              <span className="d-flex">
                <span
                  style={{
                    borderLeft: '1px solid lightgray',
                    marginRight: '5px',
                  }}
                ></span>
                <SNavLabelContainer onClick={() => openDropdownHandler(label)}>
                  <SNavLabel isOpen={isOpen}>{label}</SNavLabel>
                  <SArrowContainer
                    isOpen={isOpen}
                    onClick={e => {
                      e.stopPropagation();
                      toggleDropdown(label);
                    }}
                  >
                    <IconSvg
                      type={isOpen ? 'arrowDropdown' : 'arrowFoward'}
                      size="xs"
                    />
                  </SArrowContainer>
                </SNavLabelContainer>
              </span>
            )}
            {isOpen && (
              <Dropdown menuItems={tree} onSelectCallback={onSelectCallback} />
            )}
          </SNavLinkContainer>
        );
      })}
    </SNav>
  );
};

Nav.defaultProps = {
  navLinks: [
    {
      label: 'Gestión de Proyectadas',
      tree: [
        {
          label: 'Alta Manual',
          link: '/gestion_proyectadas_manual',
        },
        {
          label: 'Alta Masiva',
          link: '/gestion_proyectadas_masiva',
        },
      ],
    },
    {
      label: 'Posventa',
      tree: [
        {
          label: 'Posventa',
          link: '/posventa_generica',
        },
        {
          label: 'Posventa Reporte',
          link: '/posventa_reporte',
        },
      ],
    },
    {
      label: 'Corresponsalía',
      tree: [
        {
          label: 'Previsiones',
          link: '/previsiones',
        },

        {
          label: 'Gastos y Rebates',
          link: '/gastos_rebates',
        },
        {
          label: 'Cruces',
          tree: [
            {
              label: 'Reportes y Consultas',
              link: '/corresponsales_cruces_reportes_consultas',
            },
            {
              label: 'Cruces Masivos',
              link: '/corresponsales_cruces_masivos',
            },
          ],
        },
      ],
    },
    {
      label: 'Contabilidad',
      tree: [
        {
          label: 'Gestión de Contabilidad',
          link: '/contabilidad',
        },
        {
          label: 'Gestión de Resultados',
          link: '/gestion_de_resultados',
        },
        {
          label: 'Esquema Contable',
          link: '/esquema_contable',
        },
      ],
    },
    {
      label: 'Conciliaciones',
      tree: [
        {
          label: 'PreOPCAM vs Analitico TOPS',
          link: '/opcam_preopcam_tops',
        },
        {
          label: 'ABM: Rubro, Centro de Costo',
          link: '/abm_rubro_cc',
        },
        {
          label: 'Conciliación COMEX - SAP',
          link: '/conciliacion_comex_sap',
        },
        {
          label: 'Alertas Conciliación',
          link: '/alertas_conciliacion',
        },
      ],
    },
    {
      label: 'Consultas Externas',
      tree: [
        {
          label: 'CM',
          tree: [
            {
              label: 'Saldo Diario',
              link: '/cmsaldodiario',
            },
            {
              label: 'Saldo Mensual',
              link: '/cmsaldomensual',
            },
          ],
        },
        {
          label: 'STOCK',
          tree: [
            {
              label: 'OPCAM',
              link: '/opcam_reportes_consultas',
            },
          ],
        },
      ],
    },
    { label: 'Procesos', link: '/procesos' },
  ],
};

export default Nav;
