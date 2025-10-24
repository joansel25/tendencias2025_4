# pdf.py

#Este archivo contiene funciones para generar archivos PDF relacionados con los movimientos de inventario.

from reportlab.pdfgen import canvas
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle

"""
Funciones para generar reportes en formato PDF de los movimientos de inventario.

build_movimiento_id_pdf(movimiento)
    Crea un archivo PDF con la información detallada de un movimiento específico.

    Parámetros:
        movimiento (Movimiento): Instancia del modelo Movimiento con los datos del registro.

    Retorna:
        BytesIO: Objeto en memoria que contiene el PDF generado.

build_todos_movimientos_pdf(movimientos)
    Genera un archivo PDF con el listado completo de los movimientos de inventario.

    Parámetros:
        movimientos (QuerySet): Conjunto de objetos Movimiento a incluir en el reporte.

    Retorna:
        BytesIO: Objeto en memoria que contiene el PDF generado.

Dependencias:
    - reportlab: Biblioteca utilizada para la creación de documentos PDF.
    - io.BytesIO: Manejador de flujos en memoria para almacenar el archivo generado.
"""

def build_movimiento_id_pdf(movimiento):
    buf = BytesIO()
    page = canvas.Canvas(buf, pagesize=letter)
    width, height = letter

    page.setTitle(f'Movimiento de Inventario - {movimiento.id}')
    page.drawString(50, height - 30, f"Movimiento de Inventario #{movimiento.id}")

    info = [
        ["Tipo de Movimiento:", movimiento.tipo],
        ["Fecha:", str(movimiento.fecha)],
        ["Producto:", movimiento.id_producto.nombre],
        ["Cantidad:", str(movimiento.cantidad)],
        ["Cliente:", movimiento.id_cliente.nombre],
    ]

    table = Table(info, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    table.wrapOn(page, width, height)
    table.drawOn(page, 50, height - 150)

    page.showPage()
    page.save()

    buf.seek(0)
    return buf

def build_todos_movimientos_pdf(movimientos):
    buf = BytesIO()
    page = canvas.Canvas(buf, pagesize=letter)
    width, height = letter

    page.setTitle('Todos los Movimientos de Inventario')
    page.drawString(50, height - 30, "Todos los Movimientos de Inventario")

    data = [["ID", "Tipo", "Fecha", "Producto", "Cantidad", "Cliente"]]

    for movimiento in movimientos:
        data.append([
            str(movimiento.id),
            movimiento.tipo,
            str(movimiento.fecha),
            movimiento.id_producto.nombre,
            str(movimiento.cantidad),
            movimiento.id_cliente.nombre,
        ])

    table = Table(data, colWidths=[40, 60, 80, 100, 60, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    table.wrapOn(page, width, height)
    table.drawOn(page, 30, height - 100)

    page.showPage()
    page.save()

    buf.seek(0)
    return buf

def build_producto_id_pdf(producto):
    buf = BytesIO()
    page = canvas.Canvas(buf, pagesize=letter)
    width, height = letter

    page.setTitle(f'Producto - {producto.nombre}')
    page.drawString(50, height - 30, f"Ficha del Producto: {producto.nombre}")

    info = [
        ["Nombre:", producto.nombre],
        ["Precio:", str(producto.precio)],
        ["Stock:", str(producto.stock)],
        ["Categoría:", producto.id_categoria.nombre],
        ["Proveedor:", producto.id_proveedor.nombre],
    ]

    table = Table(info, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    table.wrapOn(page, width, height)
    table.drawOn(page, 50, height - 150)

    page.showPage()
    page.save()

    buf.seek(0)
    return buf

def build_todos_productos_pdf(productos):
    buf = BytesIO()
    page = canvas.Canvas(buf, pagesize=letter)
    width, height = letter

    page.setTitle('Todos los Productos')
    page.drawString(50, height - 30, "Todos los Productos")

    data = [["ID", "Nombre", "Precio", "Stock", "Categoría", "Proveedor"]]

    for producto in productos:
        data.append([
            str(producto.id),
            producto.nombre,
            str(producto.precio),
            str(producto.stock),
            producto.id_categoria.nombre,
            producto.id_proveedor.nombre,
        ])

    table = Table(data, colWidths=[40, 100, 60, 60, 100, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    table.wrapOn(page, width, height)
    table.drawOn(page, 30, height - 100)

    page.showPage()
    page.save()

    buf.seek(0)
    return buf


def build_detalle_venta_id_pdf(detalle_venta):
    buf = BytesIO()
    page = canvas.Canvas(buf, pagesize=letter)
    width, height = letter

    page.setTitle(f'Detalle de Venta - {detalle_venta.id}')
    page.drawString(50, height - 30, f"Detalle de Venta #{detalle_venta.id}")

    info = [
        ["Factura:", str(detalle_venta.id_factura.id)],
        ["Producto:", detalle_venta.id_producto.nombre],
        ["Cantidad:", str(detalle_venta.cantidad)],
        ["Precio Unitario:", str(detalle_venta.precio_unitario)],
        ["Subtotal:", str(detalle_venta.cantidad * detalle_venta.precio_unitario)],
    ]

    table = Table(info, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    table.wrapOn(page, width, height)
    table.drawOn(page, 50, height - 150)

    page.showPage()
    page.save()

    buf.seek(0)
    return buf

def build_todos_detalles_venta_pdf(detalles_venta):
    buf = BytesIO()
    page = canvas.Canvas(buf, pagesize=letter)
    width, height = letter

    page.setTitle('Todos los Detalles de Venta')
    page.drawString(50, height - 30, "Todos los Detalles de Venta")

    data = [["ID", "Factura", "Producto", "Cantidad", "Precio Unitario", "Subtotal"]]

    for detalle in detalles_venta:
        data.append([
            str(detalle.id),
            str(detalle.id_factura.id),
            detalle.id_producto.nombre,
            str(detalle.cantidad),
            str(detalle.precio_unitario),
            str(detalle.cantidad * detalle.precio_unitario),
        ])

    table = Table(data, colWidths=[40, 60, 100, 60, 80, 80])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    table.wrapOn(page, width, height)
    table.drawOn(page, 30, height - 100)

    page.showPage()
    page.save()

    buf.seek(0)
    return buf