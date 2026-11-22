export type FletSyntaxMode = 'classic' | 'modern';

export type ActiveTracePhase = 'idle' | 'typing' | 'click' | 'updated';

export interface CodeLine {
  number: number;
  text: string;
  phase?: ActiveTracePhase[];
}

export function buildPythonSource(mode: FletSyntaxMode, includeEmptyGuard: boolean): string {
  const entrypoint =
    mode === 'modern' ? '    ft.run(main)' : '    ft.app(target=main)';

  const clickBody = includeEmptyGuard
    ? `    def greet_clicked(e):
        name = name_field.value.strip()
        if name:
            greeting_text.value = f"Hello, {name}!"
        else:
            greeting_text.value = "Please enter your name first."
        page.update()`
    : `    def greet_clicked(e):
        name = name_field.value
        greeting_text.value = f"Hello, {name}!"
        page.update()`;

  return `import flet as ft


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

${clickBody}

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
${entrypoint}
`;
}

export interface RequirementItem {
  id: string;
  title: string;
  detail: string;
  controlName: string;
}

export const ASSIGNMENT_REQUIREMENTS: RequirementItem[] = [
  {
    id: 'textfield',
    title: 'TextField for user name',
    detail: 'Creates ft.TextField to capture the name entered by the user.',
    controlName: 'ft.TextField',
  },
  {
    id: 'button',
    title: 'ElevatedButton labeled "Greet Me"',
    detail: 'Renders ft.ElevatedButton with exact label text and an on_click handler.',
    controlName: 'ft.ElevatedButton',
  },
  {
    id: 'column',
    title: 'Column vertical stacking',
    detail: 'Stacks TextField, ElevatedButton, and Text vertically inside ft.Column.',
    controlName: 'ft.Column',
  },
  {
    id: 'text-update',
    title: 'Text displays "Hello, {name}!"',
    detail: 'Updates greeting_text.value dynamically using the TextField value.',
    controlName: 'ft.Text',
  },
  {
    id: 'page-update',
    title: 'Calls page.update() inside on_click',
    detail: 'Flushes the modified Text control to the Flet UI immediately on click.',
    controlName: 'page.update()',
  },
];
