import { IconSvg } from '@brick/core';
import React, { Fragment, useState } from 'react';
import {
  SArrowContainer,
  SNavLabel,
  SNavLabelContainer,
  SNavLink,
} from '../Nav.styles';

import { SDropdown, STreeChild, STreeItem } from './Dropdown.styles';

const TreeItem = ({ onSelectCallback, label, children, link }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <STreeItem>
      {link && (
        <SNavLink to={link} onClick={onSelectCallback}>
          {label}
        </SNavLink>
      )}
      {!link && (
        <SNavLabelContainer onClick={() => setIsOpen(p => !p)}>
          <SNavLabel isOpen={isOpen}>{label}</SNavLabel>
          <SArrowContainer isOpen={isOpen}>
            <IconSvg
              type={isOpen ? 'arrowDropdown' : 'arrowFoward'}
              size="xs"
            />
          </SArrowContainer>
        </SNavLabelContainer>
      )}
      {!!children && isOpen && <STreeChild>{children}</STreeChild>}
    </STreeItem>
  );
};

const Dropdown = ({ menuItems, onSelectCallback }) => {
  const createTree = rama => (
    <TreeItem
      onSelectCallback={onSelectCallback}
      label={rama.label}
      link={rama.link}
    >
      {!rama.link &&
        rama?.tree.map((subRama, index) => (
          <Fragment key={index}>{createTree(subRama)}</Fragment>
        ))}
    </TreeItem>
  );

  return (
    <SDropdown>
      {menuItems.map((subMenu, index) => (
        <Fragment key={index}>{createTree(subMenu)}</Fragment>
      ))}
    </SDropdown>
  );
};

export default Dropdown;
