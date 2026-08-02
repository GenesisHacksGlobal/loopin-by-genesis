import type { ConnectionCard } from '../types';

export const useExport = () => {
  const exportToCSV = (connections: ConnectionCard[]) => {
    if (!connections || connections.length === 0) return;

    const headers = [
      'Full Name',
      'Role / Title',
      'Event Name',
      'Timestamp',
      'Project Pitch',
      'Skill Tags',
      'Private Notes',
      'GitHub',
      'LinkedIn',
      'Twitter/X',
    ];

    const rows = connections.map((conn) => [
      `"${conn.fullName.replace(/"/g, '""')}"`,
      `"${conn.roleTitle.replace(/"/g, '""')}"`,
      `"${conn.eventName.replace(/"/g, '""')}"`,
      `"${conn.timestamp}"`,
      `"${(conn.pitch || '').replace(/"/g, '""')}"`,
      `"${(conn.tags || []).join('; ')}"`,
      `"${(conn.privateNote || '').replace(/"/g, '""')}"`,
      `"${conn.socialLinks.github || ''}"`,
      `"${conn.socialLinks.linkedin || ''}"`,
      `"${conn.socialLinks.twitter || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `loopin_genesis_connections_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTovCard = (connections: ConnectionCard[]) => {
    if (!connections || connections.length === 0) return;

    let vcfString = '';

    connections.forEach((conn) => {
      vcfString += 'BEGIN:VCARD\r\n';
      vcfString += 'VERSION:3.0\r\n';
      vcfString += `FN:${conn.fullName}\r\n`;
      vcfString += `TITLE:${conn.roleTitle}\r\n`;
      vcfString += `ORG:${conn.eventName}\r\n`;
      if (conn.socialLinks.github) vcfString += `URL;TYPE=GitHub:${conn.socialLinks.github}\r\n`;
      if (conn.socialLinks.linkedin) vcfString += `URL;TYPE=LinkedIn:${conn.socialLinks.linkedin}\r\n`;
      if (conn.socialLinks.twitter) vcfString += `URL;TYPE=Twitter:${conn.socialLinks.twitter}\r\n`;
      vcfString += `NOTE:Event: ${conn.eventName} | Pitch: ${conn.pitch} | Tags: ${conn.tags.join(', ')} | Note: ${conn.privateNote}\r\n`;
      vcfString += 'END:VCARD\r\n';
    });

    const blob = new Blob([vcfString], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `loopin_genesis_contacts_${new Date().toISOString().slice(0, 10)}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return { exportToCSV, exportTovCard };
};
