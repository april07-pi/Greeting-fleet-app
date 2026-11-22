import flet as ft


def main(page: ft.Page):
    page.title = "Greeting App"
    page.vertical_alignment = ft.MainAxisAlignment.CENTER
    page.horizontal_alignment = ft.CrossAxisAlignment.CENTER
    page.padding = 32

    name_field = ft.TextField(
        label="Enter your name",
        hint_text="e.g. Kwazi",
        width=320,
    )

    greeting_text = ft.Text(
        value="",
        size=24,
        weight=ft.FontWeight.W_600,
    )

    def greet_clicked(e):
        name = name_field.value.strip()
        if name:
            greeting_text.value = f"Hello, {name}!"
        else:
            greeting_text.value = "Please enter your name first."
        page.update()

    greet_button = ft.ElevatedButton(
        text="Greet Me",
        on_click=greet_clicked,
    )

    page.add(
        ft.Column(
            controls=[
                name_field,
                greet_button,
                greeting_text,
            ],
            alignment=ft.MainAxisAlignment.CENTER,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=16,
        )
    )


if __name__ == "__main__":
    ft.app(target=main)
