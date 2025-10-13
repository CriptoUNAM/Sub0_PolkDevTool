# 📥 Funcionalidad de Descarga de Contratos - Marketplace

## 🎯 Descripción

La funcionalidad de descarga permite a los usuarios descargar contratos inteligentes en formato de texto (.rs) desde el marketplace, listos para abrir en editores como VS Code, Cursor, o cualquier editor de texto.

## ✨ Características Implementadas

### 1. **Descarga de Archivos .rs**
- Descarga directa de contratos en formato Rust
- Nombres de archivo automáticos basados en el nombre del contrato
- Formato: `nombre-del-contrato.rs`

### 2. **Copia al Portapapeles**
- Botón de copia rápida para copiar código al portapapeles
- Feedback visual con icono de check cuando se copia exitosamente
- Timeout automático de 2 segundos

### 3. **Vista Previa del Código**
- Modal con vista previa completa del código
- Sintaxis highlighting (preparado para implementar)
- Botones de acción integrados (copiar, descargar, cerrar)

### 4. **Estados de Carga**
- Indicador de carga durante la descarga
- Botón deshabilitado durante el proceso
- Animación de spinner

## 🚀 Cómo Usar

### Descargar Contrato
1. Navega a `/marketplace`
2. Busca el contrato que deseas
3. Haz clic en "Descargar .rs"
4. El archivo se descargará automáticamente

### Copiar Código
1. Haz clic en el botón de copia (📋)
2. El código se copia al portapapeles
3. Pega en tu editor preferido

### Ver Código Completo
1. Haz clic en "Ver Código"
2. Se abre un modal con el código completo
3. Puedes copiar o descargar desde el modal

## 📁 Estructura de Archivos

```
public/examples/
├── advanced-staking-pool.rs
├── nft-marketplace.rs
├── dao-governance.rs
├── defi-lending.rs
├── cross-chain-bridge.rs
└── token-vesting.rs
```

## 🔧 Implementación Técnica

### Funciones Principales

```typescript
// Descargar archivo
const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Copiar al portapapeles
const handleCopyCode = async (contract: any) => {
  const code = getContractCode(contract.id);
  await navigator.clipboard.writeText(code);
  setCopied(contract.id);
  setTimeout(() => setCopied(null), 2000);
};
```

### Estados del Componente

```typescript
const [downloading, setDownloading] = useState<number | null>(null);
const [copied, setCopied] = useState<number | null>(null);
const [showCodeModal, setShowCodeModal] = useState<number | null>(null);
```

## 🎨 Interfaz de Usuario

### Botones de Acción
- **Descargar .rs**: Botón principal con estado de carga
- **Copiar**: Botón secundario con feedback visual
- **Ver Código**: Abre modal con vista previa
- **Favoritos**: Para marcar contratos favoritos
- **Compartir**: Para compartir contratos

### Modal de Código
- **Header**: Título del contrato y botones de acción
- **Código**: Vista previa con scroll y sintaxis
- **Footer**: Botones de descarga y cerrar

## 📊 Métricas de Descarga

- **Contador de descargas**: Se incrementa automáticamente
- **Estadísticas**: Total de descargas por contrato
- **Tendencias**: Contratos más descargados

## 🔗 Integración con Editores

### VS Code
1. Descarga el archivo .rs
2. Abre VS Code
3. Arrastra el archivo o usa Ctrl+O
4. Instala la extensión Rust Analyzer

### Cursor
1. Descarga el archivo .rs
2. Abre Cursor
3. Arrastra el archivo o usa Ctrl+O
4. El AI assistant puede ayudar con el código

### Otros Editores
- **Sublime Text**: Soporte nativo para Rust
- **Vim/Neovim**: Plugins de Rust disponibles
- **IntelliJ IDEA**: Plugin de Rust

## 🚀 Próximas Mejoras

### Funcionalidades Planificadas
- [ ] **Sintaxis Highlighting**: Resaltado de sintaxis en el modal
- [ ] **Búsqueda en Código**: Buscar texto dentro del código
- [ ] **Comparación**: Comparar versiones de contratos
- [ ] **Historial**: Historial de descargas del usuario
- [ ] **Favoritos**: Sistema de favoritos persistente
- [ ] **Comentarios**: Sistema de comentarios en contratos

### Mejoras Técnicas
- [ ] **Compresión**: Comprimir archivos grandes
- [ ] **Validación**: Validar código antes de descargar
- [ ] **Templates**: Plantillas personalizables
- [ ] **Export**: Múltiples formatos (ZIP, TAR)

## 🐛 Solución de Problemas

### Problemas Comunes

**La descarga no funciona**
- Verifica que el navegador permita descargas
- Revisa la consola para errores
- Intenta con otro navegador

**El código no se copia**
- Verifica permisos del portapapeles
- Usa HTTPS (requerido para clipboard API)
- Intenta con el botón de copia del modal

**El modal no se abre**
- Verifica que JavaScript esté habilitado
- Revisa la consola para errores
- Intenta recargar la página

## 📞 Soporte

Si tienes problemas con la funcionalidad de descarga:

1. **Revisa la consola** del navegador para errores
2. **Verifica permisos** del navegador
3. **Intenta con otro navegador** o dispositivo
4. **Reporta el problema** en GitHub Issues

---

**¡Disfruta descargando y desarrollando contratos inteligentes! 🚀**
